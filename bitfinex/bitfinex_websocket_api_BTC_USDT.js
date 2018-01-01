const mail = require('../util/mail.js')
const ws = require('ws')
const fs = require('fs')
const socket = new ws('wss://api.bitfinex.com/ws/2')

let msg = JSON.stringify({ 
   event: "subscribe",
   channel: "ticker",
   symbol: "tBTCUSD"

})
let intervalRange = 50

//let data = fs.readFileSync("./log/bidData.log",'utf8');

// fs.writeFileSync("./log/bidData.log","12312312")
// return

socket.on('open', () => socket.send(msg))

socket.on('message', (msg) => {
    console.log(msg)
    let params = {}
    let msgArr =  JSON.parse(msg)
    if(msgArr[1] != undefined && msgArr[1] != "hb") {
        let data = fs.readFileSync("./log/bidData.log");
        params.type = ""
        params.bid = msgArr[1][0]               //当前最高买价
        params.bidSize = msgArr[1][1]           //最高买价的数量
        params.ask = msgArr[1][2]               //当前最低卖价
        params.askSize = msgArr[1][3]           //最低卖价数量
        params.lastTradePoint = msgArr[1][6]    //最近交易价格
        params.dailyVolumn = msgArr[1][7]       //日成交量
        params.high = msgArr[1][8]              //今天最高价
        params.low = msgArr[1][9]               //今天最低价
        params.bidNowRange = parseInt(params.bid / intervalRange) * intervalRange
        params.bidNextRange = (parseInt(params.bid / intervalRange) + 1) * intervalRange
        if(params.bidNextRange - params.bid > params.bidNowRange - params.bid) {
            type = "down"
        } else {
            type = "up"
        }
        if(data && data != '') {
            data = JSON.parse(data)
            let nowTime = Math.round(new Date().getTime()/1000)
            console.log(data[params.bidNowRange])
            if(data[params.bidNowRange] != undefined) {
                if(type == data[params.bidNowRange]['type'] && nowTime-data[params.bidNowRange]['time'] > 20*60) {
                    data[params.bidNowRange] = {type: type, time: nowTime}
                    data = JSON.stringify(data)
                    fs.writeFileSync("./log/bidData.log",data)
                    params.subject = getMailSubject(type,params)
                    sendMail(params)
                }
            }else {
                data[params.bidNowRange] = {type: type, time: nowTime}
                data = JSON.stringify(data)
                fs.writeFileSync("./log/bidData.log",data)
                params.subject = getMailSubject(type,params)
                sendMail(params)
            }

        }
    }
})


function getMailSubject(type,params) {
    if(type == 'down') {
        return "bitfinex_bitcoin已经接近" + params.bidNextRange
    } else {
        return "bitfinex_bitcoin已经接近" + params.bidNowRange
    }
}


function sendMail(params) {
    mail.mailOptions.subject = params.subject
    mail.mailOptions.html = 
    "<b>当前max价：" + params.bid + 
    "<br>max数量:" + params.bidSize + 
    "<br>min卖价:" + params.ask + 
    "<br>min数量:" + params.askSize + 
    "<br>today成交总量：" + params.dailyVolumn + 
    "</b>"
    mail.transporter.sendMail(mail.mailOptions, (error, info) => {
        if (error) {
            console.log(error)
        }
        // console.log('Message sent: %s', info.messageId);
        // console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    });
}