import nodeMailer from 'nodemailer';

export const SendEmail = async (email: string, message: string): Promise<{ success: boolean }> => {
  try {

    const sendVerifyMail = async (email: string, message: string): Promise<boolean> => {
      try {
        const https = require('https');

        const agent = new https.Agent({
          rejectUnauthorized: false,
        });

        const transporter = nodeMailer.createTransport({
          host: 'smtp.gmail.com',
          port: 587,
          secure: false,
          requireTLS: true,
          auth: {
            user:  process.env.MAIL_USER,
            pass: process.env.MAIL_PASS,
          },
          tls: {
            rejectUnauthorized: false,
          },
         
        });

        const mailOptions = {
          from: 'divyawnd@gmail.com',
          to: email,
          subject: 'Shedule Blood donation date',
          html: `${message}`,
        };

        // Send email using the transporter
        await transporter.sendMail(mailOptions);
        console.log('Email has been sent');
        return true;
      } catch (error: any) {
        console.error('Error sending email:', error.message);
        return false;
      }
    };

    const sendMailResult = await sendVerifyMail(email, message);

    if (sendMailResult) {
      return { success: true };
    } else {
      return { success: false };
    }
  } catch (error: any) {
    console.error('Error sending message:', error.message);
    return { success: false };
  }
};















// // src/twilioService.ts

// import twilio from 'twilio';

// const accountSid = process.env.TWILIO_ACCOUNT_SID;
// const authToken = process.env.TWILIO_AUTH_TOKEN;
// const messagingServiceSid = process.env.TWILIO_MESSAGING_SERVICE_SID; 
// const twilioPhoneNumber = "+12162424358";


// const client =    twilio(accountSid, authToken);

// // export const sendWhatsAppMessage = async (to: string, body: string) => {
// //     try {
// //         const message = await client.messages.create({
// //             from: 'whatsapp:+12162424358', 
// //             to: `whatsapp:${to}`,
// //             body: body,
// //         });
// //         if(message){
// //             console.log("sending message sucess 🤷‍♀️");
// //         }else{
// //             console.log("sending message eroorr..............😢");

// //         }
// //         return message;
// //     } catch (error) {
// //         console.error('Failed to send WhatsApp message:', error);
// //         throw new Error('Failed to send WhatsApp message');
// //     }
// // };




// export async function  sendWhatsAppMessage(to: string, body: string) {
//   return client.messages
//     .create({
//       body: body,
//       from: twilioPhoneNumber,
//       to: to,
//     })
//     .then((message) => {
//         console.log(message.body)
//       console.log(`Message sent with SID: ${message.sid} 🔥🔥🔥🔥👍👍👍`);
//     })
//     .catch((error) => {
//       console.error(`Error sending message: ${error}`);
//     });
// }
