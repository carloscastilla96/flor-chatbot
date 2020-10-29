var intentClassifier = (fun) => {


 switch (fun.intent) {
  case "saludo":

   return onIntent(saludo, fun);

  case "nombre":

   return onIntent(nombre, fun);

  case "url":

   return onIntent(foto, fun);

  default:
   break;
 }

};

var onIntent = (fun, processed) => {
 try {
  console.log(`Reconocí un ${processed}`);
 } catch (error) {
  console.log(error);
 }
 return fun(processed);
};

var saludo = (processed) => {
 var obj = {
  answer: processed.answer,
  intent: processed.intent,
  utterance: processed.utterance,
  entities: processed.entities,
  stage: 1
 };

 return obj;
};


var foto = (processed) => {
 var obj = {
  answer: processed.answer,
  intent: processed.intent,
  utterance: processed.utterance,
  entities: processed.entities,
  stage: 1
 };

 return obj;
};
var nombre = (processed) => {

 console.log(processed.entities);

 var obj = {
  answer: processed.answer,
  intent: processed.intent,
  utterance: processed.utterance,
  entities: processed.entities,
  stage: 2
 };

 return obj;
};


var foto = (processed) => {

 var obj = {
  answer: processed.answer,
  intent: processed.intent,
  utterance: processed.utterance,
  entities: processed.entities,
  stage: 1
 };

 return obj;

};

var edad = (processed) => {

};

var ubicacion = (processed) => {

};


var tieneHuerta = (processed) => {

};

var despedida = (processed) => {

};

var mapa = (processed) => {

};


module.exports = {
 intentClassifier,
 onIntent,
 foto,
 saludo,
 nombre,
 foto,
 edad,
 ubicacion,
 tieneHuerta,
 despedida,
 mapa
};  