import nodemailer from "nodemailer";
import sgTransport from "nodemailer-sendgrid-transport";
import jwt from "jsonwebtoken";


export const fnLog = (message) => {

    if(process.env.LOG === "true"){
        console.log(`[${curtime('yyyy-MM-dd HH:mm:ss')}] ${message}`);
    }
}

export const generateSecret = () => {
    const randomNumber = Math.floor(Math.random()*(9999-1000+1)) + 1000;
    return `${randomNumber}`;
}

export const sendSecretMail = (toEmail, secret) => {
    const email = {
      from: process.env.SENGRID_EMAIL,
      to: toEmail,
      subject: "🔒인증번호🔒",
      html: `<h2>인증번호는 ${secret} 입니다. </h2>`
    };
    return sendMail(email);
  };

export const generateToken = id => {

fnLog(`secretKey : ${process.env.JWT_SECRET}`);

    return jwt.sign({ id }, process.env.JWT_SECRET);
}

const curtime = (format) => {
    let curtime = new Date();
    let yyyy = curtime.getFullYear().toString();
    let MM = pad(curtime.getMonth() + 1,2);
    let dd = pad(curtime.getDate(), 2);
    let HH = pad(curtime.getHours(), 2);
    let mm = pad(curtime.getMinutes(), 2);
    let ss = pad(curtime.getSeconds(), 2);
    let milli = pad(curtime.getSeconds(), 3);
    return format.replace(/yyyy/g, yyyy).replace(/MM/g, MM).replace(/dd/g, dd).replace(/HH/g, HH).replace(/mm/g, mm).replace(/ss/g, ss);
}

const pad = (number, length) => {
    let str = '' + number;
    while (str.length < length) {
        str = '0' + str;
    }
    return str;
}

const sendMail = email => {
    const options = {
      auth: {
        api_user: process.env.SENDGRID_USERNAME,
        api_key: process.env.SENGRID_PASSWORD
      }
    };
    const client = nodemailer.createTransport(sgTransport(options));
    return client.sendMail(email);
};

