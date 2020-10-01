const express = require('express');
const bodyParser = require('body-parser');
const pino = require('express-pino-logger')();
const MessagingResponse = require('twilio').twiml.MessagingResponse;

const client = require('twilio')(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN
  );
  
const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(pino);


app.get('/api/greeting', (req, res) => {
  const name = req.query.name || 'World';
  res.setHeader('Content-Type', 'application/json');
  res.send(JSON.stringify({ greeting: `Hellos ${name}!` }));
});

app.post('/inbound', (req, res) => {
      // Start our TwiML response.
      const twiml = new MessagingResponse();
      const message = twiml.message();
      const body = req.body.Body.toLowerCase();
      const from = req.body.From;
      console.log(body); 
      if (body.includes("janneth")) {
        // If the message includes "contact" send a VCard with contact details
        message.body(
            "Vitamina C"
          );
      }else {
        // Otherwise send a formatted message.
        message.body(
          "No entendí muy bien lo que dijiste"
        );
        }
        
      res.writeHead(200, {'Content-Type': 'text/xml'});
      res.end(twiml.toString());
  });

app.post('/api/messages', (req, res) => {
  res.header('Content-Type', 'application/json');
  client.messages
    .create({
      from: 'whatsapp:'+ process.env.TWILIO_PHONE_NUMBER,
      to: 'whatsapp:'+ req.body.to,
      body: req.body.body
    })
    .then(() => {
      res.send(JSON.stringify({ success: true }));
    })
    .catch(err => {
      console.log(err);
      res.send(JSON.stringify({ success: false }));
    });
}); 


app.listen(5000, () => {

    console.log("Express is running in localhost:5000");

});