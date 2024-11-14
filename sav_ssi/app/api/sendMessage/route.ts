import { NextApiRequest, NextApiResponse } from 'next';
import twilio from 'twilio';

export const POST = async (req: NextApiRequest, res: NextApiResponse) => {
  const accountSid = <string>process.env.TWILIO_ACCOUNT_SID;
  const token = <string>process.env.TWILIO_AUTH_TOKEN;
  const twilioPhoneNumber = <string>process.env.TWILIO_PHONE_NUMBER;
  const client = twilio(accountSid, token);
  const { phone, message } = req.body;
  console.log(phone, message);

  try {
    client.messages
    .create({
      body: message,
      from: twilioPhoneNumber,
      to: "773815479",
    })
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    return new Response(JSON.stringify({ success: false }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
  
}
