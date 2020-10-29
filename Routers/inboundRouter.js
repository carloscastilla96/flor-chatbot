const express = require("express");
const { ModelBuildContext } = require("twilio/lib/rest/preview/understand/assistant/modelBuild");
const MessagingResponse = require("twilio").twiml.MessagingResponse;
var nlpEngineApp = require('../Controllers/nlpEngineApp');
var nlpOnIntent = require('../Controllers/nlpOnIntentProcessor');
var admin = require("firebase-admin");


const client = require("twilio")(
 process.env.TWILIO_ACCOUNT_SID,
 process.env.TWILIO_AUTH_TOKEN
);

const router = express.Router();

const getNumber = (input) => {
 var index = input.lastIndexOf("+");
 var number = input.slice(index);
 return number;
};

router.post("/inbound", (req, res) => {
 var db = admin.database();
 // Start our TwiML response.
 const twiml = new MessagingResponse();
 const messages = twiml.message();
 var body = req.body.Body;
 const from = getNumber(req.body.From);

 console.log(req.body);

 switch (req.body.MediaContentType0) {

  case "image/jpeg":

   body = "image/jpeg";
   break;

  case "'text/vcard'":
   body = "image/jpeg";
   break;

  case "application/pdf":
   body = "image/jpeg";
   break;

  case "application/pdf":
   body = "image/jpeg";
   break;

  default:
   body = req.body.Body;
   break;
 }


}


 //application/pdf
 //video/mp4
 //'text/vcard'
 //image/jpeg

 nlpEngineApp(body, url).then(function (result) {

 try {



  var proccessedObject = nlpOnIntent.intentClassifier(result);
  if (proccessedObject.intent === "saludo") {
   var NewUserMessage = "";
   db.ref("users")
    .child(from)
    .once("value")
    .then(function (snapshot) {
     if (!snapshot.exists()) {
      db.ref("users").child(from).set({
       stage: proccessedObject.stage,
      });
      NewUserMessage =
       proccessedObject.answer;
     } else {
      var snap = snapshot.val();
      var name = snap.name;
      if (!snap.name) {
       NewUserMessage =
        "¡Buenas! Se me olvidó tu nombre. Me lo puedes recordar?";
      } else {
       NewUserMessage =
        `${tunnel} / ${from}`;
      }

     }
     return NewUserMessage;
    })
    .then(function (NewUserMessage) {
     messages.body(NewUserMessage);
     res.writeHead(200, { "Content-Type": "text/xml" });
     res.end(twiml.toString());
    });

  } else if (proccessedObject.intent === "nombre") {
   var nameMessage = "";
   db.ref("users")
    .child(from)
    .once("value")
    .then(function (snapshot) {
     var snap = snapshot.val();

     if (snap.stage > 0) {
      var userName = proccessedObject;

      db.ref("users").child(from).set({
       stage: 2,
       name: userName,
      });

      nameMessage =
       `Mucho Gusto, ${userName}!Espero poder ayudarte y conocer más sobre vos`;
     } else {
      nameMessage =
       '¡Lo siento! No pude registrar tu nombre. Prueba diciendo "Me llamo" seguido de tu nombre';
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
 } catch (error) {
  console.log(error);
 }


});



});

module.exports = router;

// const getName = function (input, type) {
//   var name = input.toLowerCase;
//   var searchTerm;
//   switch (type) {
//     case 1:
//       var searchTerm = "llamo";
//       var index = searchTerm.lastIndexOf();
//       console.log(index);
//       var name = input.slice(index);
//       break;
//     case 2:
//       var searchTerm = "nombre es";
//       var index = searchTerm.lastIndexOf();
//       console.log(index);
//       var name = input.slice(index);
//       break;
//     default:
//       var searchTerm = "";
//       var index = searchTerm.lastIndexOf();
//       console.log(index);
//       var name = input.slice(index);
//       break;
//   }

//   return name;
// };

