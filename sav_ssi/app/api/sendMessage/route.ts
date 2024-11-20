import { NextApiRequest, NextApiResponse } from 'next';
import twilio from 'twilio';

export const POST = async (req, res) => {
  const accountSid = <string>process.env.TWILIO_ACCOUNT_SID;
  const token = <string>process.env.TWILIO_AUTH_TOKEN;
  const twilioPhoneNumber = <string>process.env.TWILIO_PHONE_NUMBER;
  const client = await twilio(accountSid, token);
  const { phone, message } =await req.json();
  try {
   
    console.log("phone", phone, "message", message)
    client.messages
    .create({
      from: twilioPhoneNumber,
      to: phone,
      body: message,
    })
   
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
    });
  } catch (error) {
    console.log(error);
    return new Response(JSON.stringify({ success: false }), {
      status: 500,
    });
  }
  
}
