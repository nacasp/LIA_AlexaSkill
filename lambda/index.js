const Alexa = require('ask-sdk-core');

var correctAnswer;
//var currentScore=0;
//var numOfQuestions=data.length;

const LaunchRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'LaunchRequest';
    },
    handle(handlerInput) {
        const speakOutput = 'Willkommen beim Quiz: LIA, lernen im Alltag! Sage "starte quiz", um mit dem Lernen zu beginnen.';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

  function getQuestion(counter, item) {
    var currentQuestion=item.Frage;
    correctAnswer = item.richtigeAntwort;
    console.log("correctAnswer: " + correctAnswer);
    //the Alexa Service will present the correct ordinal (i.e. first, tenth, fifteenth) when the audio response is being delivered
    return `Hier kommt Frage Nummer ${counter}. ${item.Frage} Ist es ${item.Antworten}?`;
  }

const QuizHandler = {
    canHandle(handlerInput){
        const request = handlerInput.requestEnvelope.request;
        console.log("Inside QuizHandler");
        console.log(JSON.stringify(request));
        return request.type === "IntentRequest" &&
           (request.intent.name === "QuizIntent");
    },
    handle(handlerInput) {
        const attributes = handlerInput.attributesManager.getSessionAttributes();
        const response = handlerInput.responseBuilder;
        attributes.state = states.Quiz; 
        attributes.counter = 0;
        attributes.quizScore = 0;
        
        var question = askQuestion(handlerInput);
        var speakOutput = startQuizMessage + question;
        var repromptOutput = question;
        
        const item = attributes.quizItem;
        handlerInput.attributesManager.setSessionAttributes(attributes);
       /* if (supportsDisplay(handlerInput)) {
          const title = 'Frage #${attributes.counter}';
          const primaryText = new Alexa.RichTextContentHelper().withPrimaryText(getQuestionWithoutOrdinal(property, item)).getTextContent();
          const backgroundImage = new Alexa.ImageHelper().addImageInstance(getBackgroundImage(attributes.quizItem.Abbreviation)).getImage();
          const itemList = [];
          getAndShuffleMultipleChoiceAnswers(attributes.selectedItemIndex, item, property).forEach((x, i) => {
            itemList.push(
              {
                "token" : x,
                "textContent" : new Alexa.PlainTextContentHelper().withPrimaryText(x).getTextContent(),
              }
            );
          });
          response.addRenderTemplateDirective({
            type : 'ListTemplate1',
            token : 'Question',
            backButton : 'hidden',
            backgroundImage,
            title,
            listItems : itemList,
          });
        }*/

        return response.speak(speakOutput)
                   .reprompt(repromptOutput)
                   .getResponse();
        }
};
    
    
/*const DefinitionHandler = {
  canHandle(handlerInput) {
    console.log("Inside DefinitionHandler");
    const attributes = handlerInput.attributesManager.getSessionAttributes();
    const request = handlerInput.requestEnvelope.request;

    return attributes.state !== states.QUIZ &&
           request.type === 'IntentRequest' &&
           request.intent.name === 'AnswerIntent';
  },
  handle(handlerInput) {
    console.log("Inside DefinitionHandler - handle");
    //GRABBING ALL SLOT VALUES AND RETURNING THE MATCHING DATA OBJECT.
    const item = getItem(handlerInput.requestEnvelope.request.intent.slots);
    const response = handlerInput.responseBuilder;

    //IF THE DATA WAS FOUND
    if (item && item[Object.getOwnPropertyNames(data[0])[0]] !== undefined) {
      if (useCardsFlag) {
        response.withStandardCard(
          getCardTitle(item),
          getTextDescription(item),
          getSmallImage(item),
          getLargeImage(item))
      }

      if(supportsDisplay(handlerInput)) {
        const image = new Alexa.ImageHelper().addImageInstance(getLargeImage(item)).getImage();
        const title = getCardTitle(item);
        const primaryText = new Alexa.RichTextContentHelper().withPrimaryText(getTextDescription(item, "<br/>")).getTextContent();
        response.addRenderTemplateDirective({
          type: 'BodyTemplate2',
          backButton: 'visible',
          image,
          title,
          textContent: primaryText,
        });
      }
      return response.speak(getSpeechDescription(item))
              .reprompt(repromptSpeech)
              .getResponse();
    }
    //IF THE DATA WAS NOT FOUND
    else
    {
      return response.speak(getBadAnswer(item))
              .reprompt(getBadAnswer(item))
              .getResponse();
    }
  }
}; */

const QuizAnswerHandler = {
  canHandle(handlerInput) {
    console.log("Inside QuizAnswerHandler");
    const attributes = handlerInput.attributesManager.getSessionAttributes();
    
    const request = handlerInput.requestEnvelope.request;
 console.log("set request");
    return request.type === 'IntentRequest' &&
           request.intent.name === 'AnswerIntent';
  },
  handle(handlerInput) {
    console.log("Inside QuizAnswerHandler - handle");
    const attributes = handlerInput.attributesManager.getSessionAttributes();
     console.log("got attributes" + attributes);
    const response = handlerInput.responseBuilder;

    var speakOutput = '';
    var repromptOutput = '';
    const item = attributes.quizItem;
     console.log("set QuizAnswerHandler attributes / " + item);
     const slots = handlerInput.requestEnvelope.request.intent.slots;
    const answerValue = slots['CHOICE'].value;
    console.log(answerValue);
    console.log(correctAnswer);
    
 console.log(answerValue == correctAnswer);
    if (answerValue == correctAnswer) {
        console.log("compare true");
        speakOutput="Richtig! ";
     // speakOutput = getSpeechCon(true);
       attributes.quizScore += 1;
       handlerInput.attributesManager.setSessionAttributes(attributes);
    } else {
        console.log("compare false");
        speakOutput="Leider falsch. Richtig ist Antwort ";
        speakOutput += correctAnswer;
      //speakOutput = getSpeechCon(false);
    }

    
    console.log("correctAnswer added");
    var numOfQuestions = data.length;
    console.log(numOfQuestions);
    var question = '';
    //IF YOUR QUESTION COUNT IS LESS THAN NUM OF Q, WE NEED TO ASK ANOTHER QUESTION.
    if (attributes.counter < data.length) {
        console.log("next q");
      speakOutput += getCurrentScore(attributes.quizScore, attributes.counter);
      question = askQuestion(handlerInput);
      speakOutput += question;
      repromptOutput = question;
console.log("question added");
     /* if (supportsDisplay(handlerInput)) {
        const title = 'Frage #${attributes.counter}';
        const primaryText = new Alexa.RichTextContentHelper().withPrimaryText(getQuestionWithoutOrdinal(attributes.quizProperty, attributes.quizItem)).getTextContent();
        const backgroundImage = new Alexa.ImageHelper().addImageInstance(getBackgroundImage(attributes.quizItem.Abbreviation)).getImage();
        const itemList = [];
        getAndShuffleMultipleChoiceAnswers(attributes.selectedItemIndex, attributes.quizItem, attributes.quizProperty).forEach((x, i) => {
          itemList.push(
            {
              "token" : x,
              "textContent" : new Alexa.PlainTextContentHelper().withPrimaryText(x).getTextContent(),
            }
          );
        });
        response.addRenderTemplateDirective({
          type : 'ListTemplate1',
          token : 'Question',
          backButton : 'hidden',
          backgroundImage,
          title,
          listItems : itemList,
        });
      }*/
      return response.speak(speakOutput)
      .reprompt(repromptOutput)
      .getResponse();
    }
    else { //last q
      speakOutput += getFinalScore(attributes.quizScore, attributes.counter) + exitSkillMessage;
    /*  if(supportsDisplay(handlerInput)) {
        const title = 'Bis demnächst!';
        const primaryText = new Alexa.RichTextContentHelper().withPrimaryText(getFinalScore(attributes.quizScore, attributes.counter)).getTextContent();
        response.addRenderTemplateDirective({
          type : 'BodyTemplate1',
          backButton: 'hidden',
          title,
          textContent: primaryText,
        });
      }*/
      return response.speak(speakOutput).getResponse();
    }
  },
};

/*const RepeatHandler = {
  canHandle(handlerInput) {
    console.log("Inside RepeatHandler");
    const attributes = handlerInput.attributesManager.getSessionAttributes();
    const request = handlerInput.requestEnvelope.request;

    return attributes.state === states.QUIZ &&
           request.type === 'IntentRequest' &&
           request.intent.name === 'AMAZON.RepeatHandler';
  },
  handle(handlerInput) {
    console.log("Inside RepeatHandler - handle");
    const attributes = handlerInput.attributesManager.getSessionAttributes();
    const question = getQuestion(attributes.counter, attributes.quizproperty, attributes.quizitem);

    return handlerInput.responseBuilder
      .speak(question)
      .reprompt(question)
      .getResponse();
  },
};*/


const HelpHandler = {
  canHandle(handlerInput) {
    console.log("Inside HelpHandler");
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'IntentRequest' &&
           request.intent.name === 'AMAZON.HelpHandler';
  },
  handle(handlerInput) {
    console.log("Inside HelpHandler - handle");
    return handlerInput.responseBuilder
      .speak(helpMessage)
      .reprompt(helpMessage)
      .getResponse();
  },
};

const ExitHandler = {
  canHandle(handlerInput) {
    console.log("Inside ExitHandler");
    const attributes = handlerInput.attributesManager.getSessionAttributes();
    const request = handlerInput.requestEnvelope.request;

    return request.type === 'IntentRequest' && (
              request.intent.name === 'AMAZON.StopIntent' ||
              request.intent.name === 'AMAZON.PauseIntent' ||
              request.intent.name === 'AMAZON.CancelIntent'
           );
  },
  handle(handlerInput) {
    return handlerInput.responseBuilder
      .speak(exitSkillMessage)
      .getResponse();
  },
};

const SessionEndedRequestHandler = {
  canHandle(handlerInput) {
    console.log("Inside SessionEndedRequestHandler");
    return handlerInput.requestEnvelope.request.type === 'SessionEndedRequest';
  },
  handle(handlerInput) {
    console.log(`Session ended with reason: ${JSON.stringify(handlerInput.requestEnvelope)}`);
    return handlerInput.responseBuilder.getResponse();
  },
};

const ErrorHandler = {
  canHandle() {
    console.log("Inside ErrorHandler");
    return true;
  },
  handle(handlerInput, error) {
    console.log("Inside ErrorHandler - handle");
    console.log(`Error handled: ${JSON.stringify(error)}`);
    console.log(`Handler Input: ${JSON.stringify(handlerInput)}`);

    return handlerInput.responseBuilder
      .speak(helpMessage)
      .reprompt(helpMessage)
      .getResponse();
  },
};

/* CONSTANTS */
const skillBuilder = Alexa.SkillBuilders.custom();
const imagePath = "https://cdn.pixabay.com/photo/2021/03/03/14/01/icon-6065371_960_720.png";
const backgroundImagePath = "https://cdn.pixabay.com/photo/2021/06/24/11/18/background-6360860_960_720.png"
const speechConsCorrect = ['Richtig!', 'Korrekt!', 'Genau!'];
const speechConsWrong = ['Leider falsch.', 'Versuchs nochmal.', 'Nein, das wars nicht.'];
const data = [
  {Frage: 'Kann man mit exklusiven Gateways einen Entscheidungspunkt in einem Prozessmodell darstellen?', Antworten: 'A: Ja, B: Nein', richtigeAntwort: 'A', Bild: ''},
  {Frage: 'Welcher logistische Ausdruck entspricht dem Inklusiven Gateway?', Antworten: 'A: XOR, B: OR, C: AND', richtigeAntwort: 'B', Bild: ''},
  {Frage: 'Ist es möglich, dass in diesem Prozess Steak und Salat gleichzeitig verzehrt werden?', Antworten: 'A:Ja, B: Nein', richtigeAntwort: 'B', Bild: 'https://s3.xopic.de/moochouse-public/quizzes/3pnBPaiQsFIWaUZkjtW8yZ/55VtTy6jhWCBPGNqD0xfoH_Folie16.PNG'},
  {Frage: 'Wer darf etwas essen?', Antworten: 'A: Nur Johnny, B: Jack und Johnny, C: Jack, Johnny und Jim, D: Nur Jack', richtigeAntwort: 'D', Bild: 'https://s3.xopic.de/moochouse-public/quizzes/3bj4HnXvhL65rTLwq47SNl/66AVr0jq1kSv2040C5ryFd_Folie19.PNG'},
  {Frage: 'Können exklusive Gateways auch als zusammenführende Gateways genutzt werden?', Antworten: 'A: Ja, B: Nein', richtigeAntwort: 'A', Bild: ''},
  {Frage: 'Wie viele unterschiedliche Möglichkeiten bei der Zusammenstellung der Mahlzeiten gibt es?', Antworten: 'A: 2, B: 3, C: 4, D: 5', richtigeAntwort: 'B', Bild: 'https://s3.xopic.de/moochouse-public/quizzes/3bj4HnXvhL65rTLwq47SNl/66AVr0jq1kSv2040C5ryFd_Folie19.PNG'},
  {Frage: 'Welches Gateway löst exakt einen ausgehenden Pfad/ Zweig aus?', Antworten: 'A: Exklusives Gateway, B: Paralleles Gateway, C: Inklusives Gateway', richtigeAntwort: 'C', Bild: ''}]
  
  
const states = {
  START: '_START',
  QUIZ: '_QUIZ',
};

const welcomeMessage = 'Willkommen beim Quiz: LIA, lernen im Alltag! Sage quiz starten, um mit dem Lernen zu beginnen.';
const startQuizMessage = `OK. Ich werde dir nun ${data.length} Fragen stellen. Los gehts! `;
const exitSkillMessage = 'Bis demnächst!';
const repromptSpeech = 'Kannst du das bitte noch mal wiederholen?';
const helpMessage = 'Sage quiz starten, um mit dem Lernen zu beginnen oder Ende um das Quiz zu beenden.';
const useCardsFlag = true;



/* HELPER FUNCTIONS */

// returns true if the skill is running on a device with a display (show|spot)
/*function supportsDisplay(handlerInput) {
  var hasDisplay =
    handlerInput.requestEnvelope.context &&
    handlerInput.requestEnvelope.context.System &&
    handlerInput.requestEnvelope.context.System.device &&
    handlerInput.requestEnvelope.context.System.device.supportedInterfaces &&
    handlerInput.requestEnvelope.context.System.device.supportedInterfaces.Display
  return hasDisplay;
}*/

function getBadAnswer(item) {
  return `${helpMessage}`;
}

function getCurrentScore(score, counter) {
  return ` Du hast aktuell ${score} von ${counter} Fragen korrekt beantwortet.`;
}

function getFinalScore(score, counter) {
  return ` Das wars! Du hast insgesamt ${score} von ${counter} Fragen korrekt beantwortet.`;
}

function getCardTitle(item) {
  return item.Frage;
}

function getSmallImage() {
  return 'https://cdn.pixabay.com/photo/2021/03/03/14/01/icon-6065371_960_720.png';
}

function getLargeImage() {
  return 'https://cdn.pixabay.com/photo/2021/03/03/14/01/icon-6065371_960_720.png';
}

function getImage(height, width, label) {
  return imagePath.replace("{0}", height)
    .replace("{1}", width)
    .replace("{2}", label);
}

function getBackgroundImage(label, height = 1024, width = 600) {
  return backgroundImagePath.replace("{0}", height)
    .replace("{1}", width)
    .replace("{2}", label);
}

/*function getSpeechDescription(item) {
  
    //the Alexa Service will present the correct ordinal (i.e. first, tenth, fifteenth) when the audio response is being delivered
    return `${item.StateName} is the ${item.StatehoodOrder}th state, admitted to the Union in ${item.StatehoodYear}.  The capital of ${item.StateName} is ${item.Capital}, and the abbreviation for ${item.StateName} is <break strength='strong'/><say-as interpret-as='spell-out'>${item.Abbreviation}</say-as>.  I've added ${item.StateName} to your Alexa app.  Which other state or capital would you like to know about?`;
  }
  */
  function formatCasing(key) {
    return key.split(/(?=[A-Z])/).join(' ');
  }
  

  
  // getQuestionWithoutOrdinal returns the question without the ordinal and is
  // used for the echo show.
  function getQuestionWithoutOrdinal(item) {
    return item.Frage;
  }
  
  function getAnswer(item) {
        return `Richtig ist Antwort ${item.richtigeAntwort}.`;
  }
  
  function getRandom(min, max) {
    return Math.floor((Math.random() * ((max - min) + 1)) + min);
  }
  
  function askQuestion(handlerInput) {
    console.log("I am in askQuestion()");
    //GENERATING THE RANDOM QUESTION FROM DATA
       //GET SESSION ATTRIBUTES
    const attributes = handlerInput.attributesManager.getSessionAttributes();
     console.log("I get attributes");
    
    //const random = getRandom(0, data.length - 1); //get random num 
    const item = data[attributes.counter]; //choose random q

   console.log("I got the item");
 
  
    //SET QUESTION DATA TO ATTRIBUTES
  //  attributes.selectedItemIndex = random;
   // attributes.quizItem = item;
    attributes.counter += 1;
  
  console.log("I set ATTRIBUTES");
    //SAVE ATTRIBUTES
    handlerInput.attributesManager.setSessionAttributes(attributes);
  console.log("I saved ATTRIBUTES");
    const question = getQuestion(attributes.counter, item);
    return question;
  }
  
  function compareSlots(slots, value) {
    for (const slot in slots) {
      if (Object.prototype.hasOwnProperty.call(slots, slot) && slots[slot].value !== undefined) {
        if (slots[slot].value.toString().toLowerCase() === value.toString().toLowerCase()) {
          return true;
        }
      }
    }
  
    return false;
  }
  
  function getItem(slots) {
    const propertyArray = Object.getOwnPropertyNames(data[0]);
    let slotValue;
  
    for (const slot in slots) {
      if (Object.prototype.hasOwnProperty.call(slots, slot) && slots[slot].value !== undefined) {
        slotValue = slots[slot].value;
        for (const property in propertyArray) {
          if (Object.prototype.hasOwnProperty.call(propertyArray, property)) {
            const item = data.filter(x => x[propertyArray[property]]
              .toString().toLowerCase() === slots[slot].value.toString().toLowerCase());
            if (item.length > 0) {
              return item[0];
            }
          }
        }
      }
    }
    return slotValue;
  }
  
  function getSpeechCon(type) {
      console.log("getSpeechCon called");
    if (type){
        console.log("richtig");
        return "Richtig!"; //speechConsCorrect[getRandom(0, speechConsCorrect.length - 1)];
    }else{
        console.log("falsch");
        return "Leider falsch."; //speechConsWrong[getRandom(0, speechConsWrong.length - 1)];
    }
  }
  
  
  function getTextDescription(item) {
    let text = '';
  
    for (const key in item) {
      if (Object.prototype.hasOwnProperty.call(item, key)) {
        text += `${formatCasing(key)}: ${item[key]}\n`;
      }
    }
    return text;
  }
  
  function getAndShuffleMultipleChoiceAnswers(currentIndex, item, property) {
    return shuffle(getMultipleChoiceAnswers(currentIndex, item, property));
  }
  
  // This function randomly chooses 3 answers 2 incorrect and 1 correct answer to
  // display on the screen using the ListTemplate. It ensures that the list is unique.
  function getMultipleChoiceAnswers(currentIndex, item, property) {
  
    // insert the correct answer first
    let answerList = [item[property]];
  
    // There's a possibility that we might get duplicate answers
    // 8 states were founded in 1788
    // 4 states were founded in 1889
    // 3 states were founded in 1787
    // to prevent duplicates we need avoid index collisions and take a sample of
    // 8 + 4 + 1 = 13 answers (it's not 8+4+3 because later we take the unique
    // we only need the minimum.)
    let count = 0
    let upperBound = 12
  
    let seen = new Array();
    seen[currentIndex] = 1;
  
    while (count < upperBound) {
      let random = getRandom(0, data.length - 1);
  
      // only add if we haven't seen this index
      if ( seen[random] === undefined ) {
        answerList.push(data[random][property]);
        count++;
      }
    }
  
    // remove duplicates from the list.
    answerList = answerList.filter((v, i, a) => a.indexOf(v) === i)
    // take the first three items from the list.
    answerList = answerList.slice(0, 3);
    return answerList;
  }
  
  // This function takes the contents of an array and randomly shuffles it.
  function shuffle(array) {
    let currentIndex = array.length, temporaryValue, randomIndex;
  
    while ( 0 !== currentIndex ) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }
    return array;
  }
  
  /* LAMBDA SETUP */
  exports.handler = skillBuilder
    .addRequestHandlers(
      LaunchRequestHandler,
      QuizHandler,
      //DefinitionHandler,
      QuizAnswerHandler,
     // RepeatHandler,
      HelpHandler,
      ExitHandler,
      SessionEndedRequestHandler
    )
    .addErrorHandlers(ErrorHandler)
    .lambda();