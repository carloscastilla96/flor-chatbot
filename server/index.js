 /*
Resources for connection with express and React 
--> https://www.twilio.com/blog/react-app-with-node-js-server-proxy
--> https://github.com/philnash/send-sms-react-twilio/blob/master/server/index.js
--> https://www.twilio.com/blog/2017/10/how-to-receive-and-respond-to-a-text-message-with-node-js-express-and-twilio.html
How to receive and send different types of data
--> https://ahoy.twilio.com/location-aware-whatsapp-apac-webinar-ty?aliId=eyJpIjoidDBPYXVneUdpM3dUanZOSyIsInQiOiJwMTFvOXlWY1lDOGFqdGhjb2Y2N3pBPT0ifQ%253D%253D
Async queries in DB and express
-->https://stackoverflow.com/questions/43712720/running-queries-in-firebase-using-async-await
-->https://zellwk.com/blog/async-await-express/
-->https://stackoverflow.com/questions/48508020/javascript-wait-for-asynchronous-function-in-if-statement/48508056
parsing an incoming Twilio Message
https://www.twilio.com/blog/parsing-an-incoming-twilio-sms-webhook-with-node-js
sending scheduled messages
-->https://www.twilio.com/blog/2014/09/send-daily-sms-reminders-using-firebase-node-js-and-twilio.html
FIrebase important Stuff
-->https://firebase.google.com/docs/reference/js/firebase.database.DataSnapshot
Twilio important stuff
--> https://www.twilio.com/docs/sms/twiml/message
-->https://www.twilio.com/docs/sms/api/message-resource
Twilio media receive and send 
-->https://support.twilio.com/hc/en-us/articles/360017961894-Sending-and-Receiving-Media-with-WhatsApp-Messaging-on-Twilio-Beta-
How to make it safe 
--> https://medium.com/@victorpaulo/acme-whatsapp-banking-twilio-setup-ba562e69c50e
*/
const express = require("express");
const bodyParser = require("body-parser");
const pino = require("express-pino-logger")();
const MessagingResponse = require("twilio").twiml.MessagingResponse;
var admin = require("firebase-admin");

var serviceAccount = require("../flordb-38125-firebase-adminsdk-4c2hv-611ecdc39b.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://flordb-38125.firebaseio.com",
});

var db = admin.database();
var ref = db.ref("contacts");
ref.once("value", function (snapshot) {
  console.log(snapshot.val());
});

const client = require("twilio")(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(pino);

app.get("/api/greeting", (req, res) => {
  const name = req.query.name || "World";
  res.setHeader("Content-Type", "application/json");
  res.send(JSON.stringify({ greeting: `Hellos ${name}!` }));
});

const getName = function (input) {
  const searchTerm = "llamo";
  var index = input.search(searchTerm);
  console.log("index es" + index);
  var name = input.slice(index);
  console.log("name es" + name);
  return name;
};
// Twilio and Firebase working together https://stackoverflow.com/questions/50182368/why-is-twilio-and-firebase-not-working-cohesively-using-node-js
app.post("/inbound", async (req, res) => {
  // Start our TwiML response.
  const twiml = new MessagingResponse();
  const messages = twiml.message();
  const body = req.body.Body.toLowerCase();
  const from = req.body.From;
  var isNew;
  console.log(body);

  if (
    body.includes("hola") ||
    body.includes("buenos dias") ||
    body.includes("buenas")
  ) {
    var NewUserMessage = "";
    db.ref()
      .child("contacts")
      .orderByChild("number")
      .equalTo(req.body.From)
      .once("value")
      .then(function (snapshot) {
        if (!snapshot.exists()) {
          db.ref("contacts/users").push({
            number: from,
            title: 1,
          });
          NewUserMessage =
            "¡Buenas! Soy Luz y trabajo con la iniciativa Sembrando vida Me fascina la naturaleza y la conexión que tenemos con ella. Me gusta conocer y ayudar a personas que también les guste.  Contame, ¿Cómo te llamas?  ";
        } else {
          NewUserMessage =
            "¡Buenas! Se me olvidó tu nombre. Me lo puedes recordar?";
        }
        return NewUserMessage;
      })
      .then(function (NewUserMessage) {
        console.log(NewUserMessage);
        messages.body(NewUserMessage);
        res.writeHead(200, { "Content-Type": "text/xml" });
        res.end(twiml.toString());
      });
  } else if (body.includes("nombre") || body.includes("llamo")) {
    var nameMessage = "";
    db.ref()
      .child("contacts")
      .orderByChild("number")
      .equalTo(req.body.From)
      .once("value")
      .then(function (snapshot) {
       var titleSnap= snapshot.child("contacts/users").val(); 
        if ( titleSnap.title > 0) {
          db.ref("contacts/users").set({
            number: from,
            title: 1,
            name: body,
          });
          var nameF = getName(body);
          nameMessage =
            "Mucho Gusto," +
            nameF +
            "!Espero poder ayudarte y conocer más sobre vos";
        } else {
          nameMessage =
            '¡Lo siento! No pude registrar tu nombre. Prueba diciendo " Me llamo " seguido de tu nombre';
        }
        return nameMessage;
      })
      .then(function (nameMessage) {
        console.log(nameMessage);
        messages.body(nameMessage);
        res.writeHead(200, { "Content-Type": "text/xml" });
        res.end(twiml.toString());
      });
  } else {
    // Otherwise send a formatted message.
    var errorMessage = "No entendí muy bien lo que dijiste";
    twiml.message(errorMessage);
    res.writeHead(200, { "Content-Type": "text/xml" });
    res.end(twiml.toString());
  }
});

app.post("/api/messages", (req, res) => {
  res.header("Content-Type", "application/json");
  client.messages
    .create({
      from: "whatsapp:" + process.env.TWILIO_PHONE_NUMBER,
      to: "whatsapp:" + req.body.to,
      body: req.body.body,
    })
    .then(() => {
      res.send(JSON.stringify({ success: true }));
    })
    .catch((err) => {
      console.log(err);
      res.send(JSON.stringify({ success: false }));
    });
});

app.listen(5000, () => {
  console.log("Express is running in localhost:5000");
});
