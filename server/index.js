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

const db = admin.database();

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
  if (input.includes("mi nombre es")) {
    const searchTerm = "es";
    const index = input.lastIndexOf(searchTerm);
    const name = input.slice(index);
    console.log(index);
    return name;
  } else {
    return "";
  }
};

app.post("/inbound", (req, res) => {
  // Start our TwiML response.
  const twiml = new MessagingResponse();
  const message = twiml.message();
  const body = req.body.Body.toLowerCase();
  const from = req.body.From;
  var isNew = ""; 
  console.log(body);

  if(isNew){
    message.body("*Hola* Me llamo *Flor*, ¿Cuál es tu nombre?");
  }else if(!isNew){
    message.body("Bienvenido de nuevo");
  }
  
  if (body.includes("hola")) {
    db.ref()
      .child("contacts")
      .orderByChild("number")
      .equalTo(req.body.From)
      .once("value", (snapshot) => {
        if (!snapshot.exists()) {
          const message = twiml.message();
          const newContact = {
            number: from,
            name: "",
            location: "",
            age: "",
          };
          db.ref("contacts").push(newContact);
         isNew = true; 
         console.log("i dontknow this guy" +isNew);
        } else {
          isNew = false;
          console.log("i know this guy" +isNew);
          console.log("exists!", snapshot.exists());
        }
      });
  } else if (body.includes("nombre") || body.includes("llamo")) {
    db.ref
      .child("users")
      .orderByChild("ID")
      .equalTo(req.body.From)
      .once("value", (snapshot) => {
        if (snapshot.exists()) {
          usersRef.child(req.body.From).set({
            name: req.body.Body,
          });
          console.log("exists!", userData);
        }
      });
  } else {
    // Otherwise send a formatted message.
    message.body("No entendí muy bien lo que dijiste");
  }

  res.writeHead(200, { "Content-Type": "text/xml" });
  res.end(twiml.toString());
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
