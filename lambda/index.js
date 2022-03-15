const Alexa = require('ask-sdk-core');

var correctAnswer;
var questionNum=0;
var currentQuestion="";
var choices="";

const LaunchRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'LaunchRequest';
    },
    handle(handlerInput) {
        const speakOutput = 'Willkommen beim Quiz: LIA, lernen im Alltag! Sage "starte quiz", um mit dem Lernen zu beginnen.';

        var title = "LIA - Lernen im Alltag";
        var cardText = "Willkommen beim Quiz: LIA, lernen im Alltag! ";
        var image = "https://bilderupload.org/image/ce1a78521-827f55e3-7a9b-4b8f-a46d-1.jpg";

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .withStandardCard(title,cardText,null, image)
            .getResponse();
    }
};


  function getQuestion(counter, item) {
    currentQuestion=item.Frage;
    choices=item.Antworten;
    correctAnswer = item.richtigeAntwort;
    console.log("correctAnswer: " + correctAnswer);

    return ` Hier kommt Frage Nummer ${counter}. ${item.Frage} Ist es ${item.Antworten}?`;
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
       
        var title = `Frage #${attributes.counter}`;
        var cardText = currentQuestion + "\n" + choices;
        var image = link[questionNum-1];
        
        return response.speak(speakOutput)
                   .reprompt(repromptOutput)
                   .withStandardCard(title,cardText,null,image)
                   .getResponse();
        }
};
    
    

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
       attributes.quizScore += 1;
       handlerInput.attributesManager.setSessionAttributes(attributes);
    } else {
        console.log("compare false");
        speakOutput="Leider falsch. Richtig ist Antwort ";
        speakOutput += correctAnswer;
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
      var title = `Frage #${attributes.counter}`;
        var cardText = currentQuestion + "\n" + choices;
        var image = link[questionNum-1];
        console.log("questionNum " + questionNum);
        console.log("question added");

      return response.speak(speakOutput)
      .reprompt(repromptOutput)
      .withStandardCard(title,cardText,image)
      .getResponse();
    }
    else { //if last question
      speakOutput += getFinalScore(attributes.quizScore, attributes.counter) + exitSkillMessage;
   
      return response.speak(speakOutput).getResponse();
    }
  },
};




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
  {Frage: 'Kann man mit exklusiven Gateways einen Entscheidungspunkt in einem Prozessmodell darstellen?', Antworten: 'A:Ja,  B:Nein', richtigeAntwort: 'A'},
  {Frage: 'Welcher logistische Ausdruck entspricht dem Inklusiven Gateway?', Antworten: 'A:XOR,  B:OR,  C:AND', richtigeAntwort: 'B'},
  {Frage: 'Ist es möglich, dass in diesem Prozess Steak und Salat gleichzeitig verzehrt werden?', Antworten: 'A:Ja,  B:Nein', richtigeAntwort: 'B'},
  {Frage: 'Wer darf etwas essen?', Antworten: 'A:Nur Johnny,  B:Jack und Johnny, C:Jack, Johnny und Jim, D:Nur Jack', richtigeAntwort: 'D'},
  {Frage: 'Können exklusive Gateways auch als zusammenführende Gateways genutzt werden?', Antworten: 'A:Ja, B:Nein', richtigeAntwort: 'A'},
  {Frage: 'Wie viele unterschiedliche Möglichkeiten bei der Zusammenstellung der Mahlzeiten gibt es?', Antworten: 'A:2,  B:3,  C:4,  D:5', richtigeAntwort: 'B'},
  {Frage: 'Welches Gateway löst exakt einen ausgehenden Pfad/ Zweig aus?', Antworten: 'A:Exklusives Gateway, B:Paralleles Gateway, C:Inklusives Gateway', richtigeAntwort: 'C'}]
  
const link = ["https://trustmary.com/wp-content/uploads/2020/09/pexels-pixabay-356079.jpg",
"https://trustmary.com/wp-content/uploads/2020/09/pexels-pixabay-356079.jpg",
"https://s3.xopic.de/moochouse-public/quizzes/3pnBPaiQsFIWaUZkjtW8yZ/55VtTy6jhWCBPGNqD0xfoH_Folie16.PNG",
"https://s3.xopic.de/moochouse-public/quizzes/6xJxlk5fs4vyaWVCkXyeyl/4V0YclC7KKobJFfPif710L_Folie24.PNG",
"https://trustmary.com/wp-content/uploads/2020/09/pexels-pixabay-356079.jpg",
"https://s3.xopic.de/moochouse-public/quizzes/3bj4HnXvhL65rTLwq47SNl/66AVr0jq1kSv2040C5ryFd_Folie19.PNG",
"https://trustmary.com/wp-content/uploads/2020/09/pexels-pixabay-356079.jpg"];

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


function getBadAnswer(item) {
  return `${helpMessage}`;
}

function getCurrentScore(score, counter) {
  return ` Du hast aktuell ${score} von ${data.length} Fragen korrekt beantwortet.`;
}

function getFinalScore(score, counter) {
  return ` Das wars! Du hast insgesamt ${score} von ${data.length} Fragen korrekt beantwortet.`;
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
    questionNum +=1;
   
    const item = data[attributes.counter]; //choose random q

   console.log("I got the item");
 
  
    //SET QUESTION DATA TO ATTRIBUTES
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
      QuizAnswerHandler,
      HelpHandler,
      ExitHandler,
      SessionEndedRequestHandler
    )
    .addErrorHandlers(ErrorHandler)
    .lambda();