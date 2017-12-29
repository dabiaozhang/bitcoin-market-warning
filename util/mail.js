const nodemailer = require('nodemailer')

var mail = {};

let account = {user:"zhangchun6789@163.com",pass:"Zhangchun900401"}

mail.transporter = nodemailer.createTransport({
    host: 'smtp.163.com',
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
        user: account.user, // generated ethereal user
        pass: account.pass  // generated ethereal password
    }
});

mail.mailOptions = {
    from: 'zhangchun6789@163.com', // sender address
    to: '549783842@qq.com', // list of receivers
    subject: 'bitcoin', // Subject line
    text: 'bitcoin', // plain text body
    html: '<b>bitcoin</b>' // html body
};

module.exports = mail