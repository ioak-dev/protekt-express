
var express = require('express'),
    path = require('path'),
    nodeMailer = require('nodemailer'),
    bodyParser = require('body-parser');

module.exports = {
    sendEmail: function (to, subject, htmlbody, attachment) {
        console.log('inside send email function');
        let transporter = getTransporter();
        let mailOptions = {};
        if (attachment === null || attachment === undefined) {
            mailOptions = {
                from: 'curate.ioak@gmail.com',
                to: to,
                subject: subject,
                html: htmlbody
            };
        }else {
            mailOptions = {
                from: 'curate.ioak@gmail.com',
                to: to,
                subject: subject,
                attachments: [attachment],
                html: htmlbody
            };
        }


        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return console.log(error);
            }
            console.log('Message %s sent: %s', info.messageId, info.response);
            res.render('index');
        });
}}

function getTransporter(){
    return nodeMailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            user: 'curate.ioak@gmail.com',
            pass: 'v1$3GLd!Y55w%J72!Xwy^EWj#'
        }
    });
}

