const MessagingResponse = require("twilio").twiml.MessagingResponse;


const sendTMessage = (res, mssg) => {
 // Start our TwiML response.
 const twiml = new MessagingResponse();
 const messages = twiml.message();
 var NewUserMessage = mssg.toString().trim();
 messages.body(NewUserMessage);
 res.writeHead(200, { "Content-Type": "text/xml" });
 res.end(twiml.toString());
};

module.exports = { sendTMessage }; 