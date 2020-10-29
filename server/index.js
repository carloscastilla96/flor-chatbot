const express = require("express");
const bodyParser = require("body-parser");
const pino = require("express-pino-logger")();
const inboundRoute = require('../Routers/inboundRouter');
var serviceAccount = require("../flordb-38125-firebase-adminsdk-4c2hv-611ecdc39b.json");
var admin = require("firebase-admin");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://flordb-38125.firebaseio.com",
});

//Ngrok current tunnel 
const tunnel = 'https://dff4f3cf982a.ngrok.io';

var db = admin.database();

const app = express();

//Accepting form data 
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(pino);


app.get('/:userId', function (req, res) {
  console.log(req.params);
  res.setHeader("Content-Type", "application/json");
  db.ref("users")
    .child(req.params.userId)
    .once("value")
    .then(function (snapshot) {
      var snap = snapshot.val();
      if (!snapshot.exists()) {
        res.send(JSON.stringify("nothing here"));
      } else {
        res.send(JSON.stringify({ greeting: `Hello ${snap.name}!`, stage: `Hello ${snap.stage}!` }));
      }
    });
});


app.use(inboundRoute);
//404 route  

app.use((req, res) => {

  res.status(400).send('<p>404</p>');

});

app.listen(5000, () => {
  console.log("Express is running in localhost:5000");
});


