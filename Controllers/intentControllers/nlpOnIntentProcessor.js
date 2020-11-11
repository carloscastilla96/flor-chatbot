

saludo = (processed) => {
  console.log("desde" + processed.answer);

  var obj = {
    answer: processed.answer,
    intent: processed.intent,
    utterance: processed.utterance,
    entities: processed.entities,
    stage: 1
  };

  return obj;
};
foto = (processed) => {

  var obj = {
    answer: processed.answer,
    intent: processed.intent,
    utterance: processed.utterance,
    entities: processed.entities,
    stage: 1
  };

  return obj;
};
nombre = (processed) => {

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

foto = (processed) => {

  var obj = {
    answer: processed.answer,
    intent: processed.intent,
    utterance: processed.utterance,
    entities: processed.entities,
    stage: 1
  };

  return obj;

};

edad = (processed) => {

};

ubicacion = (processed) => {

};


tieneHuerta = (processed) => {

};

despedida = (processed) => {

};

mapa = (processed) => {

};

intentClassifier = (fun) => {
  var fn = fun.intent.toString().trim();
  // function exists
  if (fn in global && typeof global[fn] === "function") {
    return global[fn](fun);
  }

  // function does not exist
  else {
    console.log("could not find " + fn + " function");
  }
};

module.exports = {
  intentClassifier,
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