import twilio from "twilio";

export const getTwilioClient = () => {
  const twilioSid = process.env.TWILIO_SID;
  const twilioAuthToken = process.env.TWILIO_AUTH_TOKEN;
  if (!twilioSid || !twilioAuthToken) {
    throw new Error("Twilio credential not configured");
  }
  return twilio(twilioSid, twilioAuthToken);
};

export const isValidPhone = (phone: string) => {
  const twilioPhone_e164 = /^\+[1-9]\d{1,14}$/;
  return twilioPhone_e164.test(phone);
};
