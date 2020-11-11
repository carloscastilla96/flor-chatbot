var nlpEngineApp = require('../Controllers/nlpEngineApp');
var nlpOnIntent = require('./intentControllers/nlpOnIntentProcessor');
var TMessagingController = require("./messagingController");


const inboundReceiver = (req, res) => {

  var body = req.body.Body;
  const from = getNumber(req.body.From);

  nlpEngineApp(body)
    .then((result) => nlpOnIntent.intentClassifier(result))
    .then((result2) => {
      console.log("Inbound Return" + result2);
      TMessagingController.sendTMessage(res, result2.answer);
    }).catch((error) => console.log(error.message));
}

const getNumber = (input) => {
  var index = input.lastIndexOf("+");
  var number = input.slice(index);
  return number;
};

module.exports = {
  inboundReceiver
};


// switch (req.body.MediaContentType0) {

//   case "image/jpeg":

//     body = "image/jpeg";
//     break;

//   case "'text/vcard'":
//     body = "image/jpeg";
//     break;

//   case "application/pdf":
//     body = "image/jpeg";
//     break;

//   case "application/pdf":
//     body = "image/jpeg";
//     break;

//   default:
//     body = req.body.Body;
//     break;


// }

//application/pdf
//video/mp4
//'text/vcard'
//image/jpeg
