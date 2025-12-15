// src/utils/emailService.js
// En producción, se usaría Nodemailer + un proveedor como SendGrid o Mailgun
const sendEmail = (to, subject, htmlContent) => {
    console.log(`\n--- 📧 Email enviado ---`);
    console.log(`A: ${to}`);
    console.log(`Asunto: ${subject}`);
    console.log(`Contenido: ${htmlContent}`);
    console.log(`------------------------\n`);
    // Lógica real: nodemailer.sendMail(...)
    return true; 
};

exports.sendCommentApprovedNotification = (postTitle, userEmail) => {
    const subject = `¡Tu comentario ha sido aprobado en: ${postTitle}!`;
    const html = `<p>Felicidades, tu comentario sobre "${postTitle}" ha sido publicado.</p>`;
    sendEmail(userEmail, subject, html);
};