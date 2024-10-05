const nodemailer = require('nodemailer');

const sendEmailNotification = async (userEmail, subject, text) => {
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'your-email@gmail.com', 
            pass: 'your-email-password',    
        },
    });

    const mailOptions = {
        from: 'your-email@gmail.com',
        to: userEmail,
        subject: subject,
        text: text,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('E-posta gönderildi:', mailOptions.to);
    } catch (error) {
        console.error('E-posta gönderilemedi', error);
    }
};

module.exports = sendEmailNotification;
