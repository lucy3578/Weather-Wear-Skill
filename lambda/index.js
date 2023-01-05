const Alexa = require('ask-sdk-core');  
  
const LaunchRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'LaunchRequest';
    },
    handle(handlerInput) {
        const speakOutput = 'Welcome to the Weather Wear skill. You can say How do I dress for the weather today? or What precautions should I take before going out? or help. Which would you like to try?';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

const CheckWeatherIntentHandler = {  
  canHandle(handlerInput) {  
    return handlerInput.requestEnvelope.request.type === 'LaunchRequest'  
      || (handlerInput.requestEnvelope.request.type === 'IntentRequest'  
      && handlerInput.requestEnvelope.request.intent.name === 'CheckWeatherIntent');  
  },  
  async handle(handlerInput) {  
    let outputSpeech;
  
    await CheckWeatherIntent('https://api.openweathermap.org/data/2.5/weather?lat=43.466667&lon=-80.516670&appid=cb9271375bbdc2b172ecffb68fb46dcc')
      .then((response) => {  
        const data = JSON.parse(response);  
            var tempValue = (data ['main']['temp'])-273.15;
            if (tempValue<0){
                outputSpeech = 'Prepare yourself because it is going to be freezing outside! Put on an insulated winter coat, some warm boots, and be sure to not expose your legs!';
            }
            else if (tempValue<5){
                outputSpeech = 'It is quite cold today! Be sure to put on a medium-light jacket, long pants, and some close-toed shoes!';
            }
            else if (tempValue<10){
                outputSpeech = 'It will be chilly out! Put on a thin jacket, some long pants, and close-toed shoes if you want to stay warm.';
            }
            else if (tempValue<15){
                outputSpeech = 'It is slightly chilly today! Any cozy long sleeve top, like hoodies or sweaters will do. Put on some long pants, preferably close-toed shoes and you are good to go!';
            }
            else if(tempValue<20){
                outputSpeech = 'The weather is quite perfect out. Put on thin long sleeves, any breathable shoes of your liking, thin pants, or even shorts or skirts if you will be moving around!';
            }
            else if(tempValue<25){
                outputSpeech = 'The weather is perfect outside! Put on short sleeves, any breathable shoes of your liking, and thin pants, shorts or skirts!';
            }
            else {
                outputSpeech = 'It is very hot out! This is probably as hot as Waterloo gets. Put on any summer clothing that will let you stay as cool as possible!';
            }
            
      })  
      .catch((err) => {  
        console.log(`ERROR: ${err.message}`);  
          
      });  
  
    return handlerInput.responseBuilder  
      .speak(outputSpeech)  
      .getResponse();  
  },  
};  
 
 const InclementReminderIntentHandler = {  
  canHandle(handlerInput) {  
    return handlerInput.requestEnvelope.request.type === 'LaunchRequest'  
      || (handlerInput.requestEnvelope.request.type === 'IntentRequest'  
      && handlerInput.requestEnvelope.request.intent.name === 'InclementReminderIntent');  
  },  
  async handle(handlerInput) {  
    let outputSpeech;
  
    await InclementReminderIntent('https://api.openweathermap.org/data/2.5/weather?lat=43.466667&lon=-80.516670&appid=cb9271375bbdc2b172ecffb68fb46dcc')
      .then((response) => {  
        const data = JSON.parse(response);  
            var descValueUpper = data ['weather'][0]['description'];
            var descValue = descValueUpper.toLowerCase();
            if (descValue.includes("snow" || "blizzard")){
                outputSpeech = 'Reminder to wear a water resistant coat and some snow boots as it is snowing outside.';
            }
            if (descValue.includes("rain"||"storm")){
                outputSpeech = 'Make sure to bring an umbrella and wear waterproof clothing as it is raining outside.';
            }
            if (descValue.includes("hail")){
                outputSpeech = 'Make sure to bring an umbrella and be extra careful as it is hailing outside.';
            }
            if (descValue.includes("sunny")){
                outputSpeech = 'Put on some sunscreen as it will be quite sunny!';
            } 
            if (descValue.includes("mist")){
                outputSpeech = 'It is misty out. Be careful if you plan on driving!';
            }  
            else {
                outputSpeech = 'The weather seems fine out. Nothing to worry about. Enjoy your day!'
            }
            
      })  
      .catch((err) => {  
        console.log(`ERROR: ${err.message}`);  
          
      });  
  
    return handlerInput.responseBuilder  
      .speak(outputSpeech)  
      .getResponse();  
  },  
};  

const HelpIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.HelpIntent';
    },
    handle(handlerInput) {
        const speakOutput = 'You can say how should I dress for the weather today in order to check what clothing is suitable for Waterloo\'s weather today. Or, you can say What precautions should I take before going out? to learn about safety reminders. How can I help?';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

const CancelAndStopIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && (Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.CancelIntent'
                || Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.StopIntent');
    },
    handle(handlerInput) {
        const speakOutput = 'Goodbye and watch out for the geese outside!';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .getResponse();
    }
};
/* *
 * FallbackIntent triggers when a customer says something that doesn’t map to any intents in your skill
 * It must also be defined in the language model (if the locale supports it)
 * This handler can be safely added but will be ingnored in locales that do not support it yet 
 * */
const FallbackIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.FallbackIntent';
    },
    handle(handlerInput) {
        const speakOutput = 'Sorry, I don\'t know about that. Please try again.';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};
/* *
 * SessionEndedRequest notifies that a session was ended. This handler will be triggered when a currently open 
 * session is closed for one of the following reasons: 1) The user says "exit" or "quit". 2) The user does not 
 * respond or says something that does not match an intent defined in your voice model. 3) An error occurs 
 * */
const SessionEndedRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'SessionEndedRequest';
    },
    handle(handlerInput) {
        console.log(`~~~~ Session ended: ${JSON.stringify(handlerInput.requestEnvelope)}`);
        // Any cleanup logic goes here.
        return handlerInput.responseBuilder.getResponse(); // notice we send an empty response
    }
};
/* *
 * The intent reflector is used for interaction model testing and debugging.
 * It will simply repeat the intent the user said. You can create custom handlers for your intents 
 * by defining them above, then also adding them to the request handler chain below 
 * */
const IntentReflectorHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest';
    },
    handle(handlerInput) {
        const intentName = Alexa.getIntentName(handlerInput.requestEnvelope);
        const speakOutput = `You just triggered ${intentName}`;

        return handlerInput.responseBuilder
            .speak(speakOutput)
            //.reprompt('add a reprompt if you want to keep the session open for the user to respond')
            .getResponse();
    }
};
/**
 * Generic error handling to capture any syntax or routing errors. If you receive an error
 * stating the request handler chain is not found, you have not implemented a handler for
 * the intent being invoked or included it in the skill builder below 
 * */
const ErrorHandler = {
    canHandle() {
        return true;
    },
    handle(handlerInput, error) {
        const speakOutput = 'Sorry, I had trouble doing what you asked. Please try again.';
        console.log(`~~~~ Error handled: ${JSON.stringify(error)}`);

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};
const CheckWeatherIntent = (url) => new Promise((resolve, reject) => {  
  const client = url.startsWith('https') ? require('https') : require('http');  
  const request = client.get(url, (response) => {  
    if (response.statusCode < 200 || response.statusCode > 299) {  
      reject(new Error(`Failed with status code: ${response.statusCode}`));  
    }  
    const body = [];  
    response.on('data', (chunk) => body.push(chunk));  
    response.on('end', () => resolve(body.join('')));  
  });  
  request.on('error', (err) => reject(err));  
}); 
const InclementReminderIntent = (url) => new Promise((resolve, reject) => {  
  const client = url.startsWith('https') ? require('https') : require('http');  
  const request = client.get(url, (response) => {  
    if (response.statusCode < 200 || response.statusCode > 299) {  
      reject(new Error(`Failed with status code: ${response.statusCode}`));  
    }  
    const body = [];  
    response.on('data', (chunk) => body.push(chunk));  
    response.on('end', () => resolve(body.join('')));  
  });  
  request.on('error', (err) => reject(err));  
});
  
const skillBuilder = Alexa.SkillBuilders.custom();  

/**
 * This handler acts as the entry point for your skill, routing all request and response
 * payloads to the handlers above. Make sure any new handlers or interceptors you've
 * defined are included below. The order matters - they're processed top to bottom 
 * */
exports.handler = Alexa.SkillBuilders.custom()
    .addRequestHandlers(
        LaunchRequestHandler,
        CheckWeatherIntentHandler,
        InclementReminderIntentHandler,
        HelpIntentHandler,
        CancelAndStopIntentHandler,
        FallbackIntentHandler,
        SessionEndedRequestHandler,
        IntentReflectorHandler)
    .addErrorHandlers(
        ErrorHandler)
    .withCustomUserAgent('sample/hello-world/v1.2')
    .lambda();