const { dockStart } = require('@nlpjs/basic');
// can be used for context
const { ConversationContext } = require('node-nlp');
var json = require('../corpus.json');

/* 
Maybe explore later
function onIntent(nlp, input) {
  if (input.intent === 'despedida') {
    const output = input;
    output.answer = 'this has been modified';
    console.log(output.answer);
  }
  return input;
}
 */

var main = async (input) => {
  const context = new ConversationContext();
  const dock = await dockStart({
    "settings": {
      "nlp": {
        "corpora": [
          json
        ],
        "nlu": { "log": false }
      }
    },
    "use": ["Basic"]
  });

  const nlp = dock.get('nlp');
  //Maybe later try to check this out
  //nlp.onIntent = onIntent;
  await nlp.train();
  const response = await nlp.process('es', input, context);
  return response;
};



module.exports = main; 