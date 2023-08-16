const nodemailer = require('nodemailer')
const pug = require('pug')
const juice = require('juice')
const htmlToText = require('html-to-text')
const util = require('util')
const emailConfig = require('../config/email')


let transport = nodemailer.createTransport({
    host: emailConfig.host,
    port: emailConfig.port,
    auth: {
    // TODO: replace `user` and `pass` values from <https://forwardemail.net>
        user: emailConfig.user,
        pass: emailConfig.pass
    }
})

//generar html

const generarHtml = (archivo, opciones ={})=>{
    const html = pug.renderFile(`${__dirname}/../views/emails/${archivo}.pug`, opciones)

    return juice(html)
}

exports.enviar = async (opciones)=>{

    //const html = generarHtml(opciones.archivo, opciones)
    //const text = htmlToText.fromString(html)

    let mailOptions = {
        from: '"Uptask 👻" <no-reply@uptask.com>', // sender address
        to: opciones.usuario.email, // list of receivers
        subject: opciones.subject, // Subject line
        text: 'hola' , // plain text body
        html: generarHtml(opciones.archivo, opciones), // html body
    }

    const enviarEmail = util.promisify(transport.sendMail, transport)

    return enviarEmail.call(transport, mailOptions)
    //transport.sendMail(mailOptions)

}

/*async function main() {
    // send mail with defined transport object
    const info = await transport.sendMail({
      from: '"Uptask 👻" <no-reply@uptask.com>', // sender address
      to: "correo@correo.com", // list of receivers
      subject: "Password reset", // Subject line
      text: "Hola", // plain text body
      html: generarHtml(), // html body
    });
  
    console.log("Message sent: %s", info.messageId);
    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
  
    //
    // NOTE: You can go to https://forwardemail.net/my-account/emails to see your email delivery status and preview
    //       Or you can use the "preview-email" npm package to preview emails locally in browsers and iOS Simulator
    //       <https://github.com/forwardemail/preview-email>
    //
  }

  main().catch(console.error);*/