var admin = require("firebase-admin");
var db = admin.database();

(() => {
 (db) ? console.log("Established Connection here") : console.log("Connection not establishedhere");
})();
var writeUserDB = (obj, key) => {

 db.ref("users")
  .child(key)
  .once("value")
  .then((snapshot) => { db.ref("users").child(from).set({ obj }) })

};


  // try {
  //   var proccessedObject = nlpOnIntent.intentClassifier(result);
  //   if (proccessedObject.intent === "saludo") {
  //     var NewUserMessage = "";
  //     db.ref("users")
  //       .child(from)
  //       .once("value")
  //       .then(function (snapshot) {
  //         if (!snapshot.exists()) {
  //           db.ref("users").child(from).set({
  //             stage: proccessedObject.stage,
  //           });
  //           NewUserMessage =
  //             proccessedObject.answer;
  //         } else {
  //           var snap = snapshot.val();
  //           var name = snap.name;
  //           if (!snap.name) {
  //             NewUserMessage =
  //               "¡Buenas! Se me olvidó tu nombre. Me lo puedes recordar?";
  //           } else {
  //             NewUserMessage =
  //               `${tunnel} / ${from}`;
  //           }
  //         }
  //         return NewUserMessage;
  //       })
  //       .then(function (NewUserMessage) {
  //         messages.body(NewUserMessage);
  //         res.writeHead(200, { "Content-Type": "text/xml" });
  //         res.end(twiml.toString());
  //       });

  //   } else if (proccessedObject.intent === "nombre") {
  //     var nameMessage = "";
  //     db.ref("users")
  //       .child(from)
  //       .once("value")
  //       .then(function (snapshot) {
  //         var snap = snapshot.val();

  //         if (snap.stage > 0) {
  //           var userName = proccessedObject;

  //           db.ref("users").child(from).set({
  //             stage: 2,
  //             name: userName,
  //           });

  //           nameMessage =
  //             `Mucho Gusto, ${userName}!Espero poder ayudarte y conocer más sobre vos`;
  //         } else {
  //           nameMessage =
  //             '¡Lo siento! No pude registrar tu nombre. Prueba diciendo "Me llamo" seguido de tu nombre';
  //         }
  //         return nameMessage;
  //       })
  //       .then(function (nameMessage) {
  //         console.log(nameMessage);
  //         messages.body(nameMessage);
  //         res.writeHead(200, { "Content-Type": "text/xml" });
  //         res.end(twiml.toString());
  //       });
  //   } else {
  //     // Otherwise send a formatted message.
  //     var errorMessage = "No entendí muy bien lo que dijiste";
  //     twiml.message(errorMessage);
  //     res.writeHead(200, { "Content-Type": "text/xml" });
  //     res.end(twiml.toString());
  //   }
  // } catch (error) {
  //   console.log(error);
  // }

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

