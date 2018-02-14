const nodemailer = require('nodemailer')
const account = require('./mail_config.js')
var mail = {};

mail.transporter = nodemailer.createTransport({
    host: 'smtp.qq.com',
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
        user: account.user, // generated ethereal user
        pass: account.pass  // generated ethereal password
    }
});

mail.mailOptions = {
    from: '1342585809@qq.com', // sender address
    to: '549783842@qq.com,chaoran7@126.com,435153071@qq.com,yuejer@163.com,zwkwd2008@163.com', // list of receivers
    //to: '549783842@qq.com', // list of receivers
    subject: 'bitcoin', // Subject line
    text: 'bitcoin', // plain text body
    html: '<b>bitcoin</b>' // html body
};

module.exports = mail