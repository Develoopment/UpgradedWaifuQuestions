import { useState, useEffect, useRef } from 'react';
import questions from './utilities/questions.json';
import dialogueLines from './utilities/dialogueLines.js';
import useType from './utilities/typeEffect.js';

// Import background and character images
import backgroundImage from './assets/Background.jpg';
import smileImage from './assets/smile.png';
import delightedImage from './assets/delighted.png';
import annoyedImage from './assets/annoyed.png';
import shockedImage from './assets/shocked.png';
import sleepyImage from './assets/sleepy.png';

const Game = () => {
  // Function to get the correct character image based on state
  const getCharacterImage = (state) => {
    switch(state) {
      case 'smile': return smileImage;
      case 'delighted': return delightedImage;
      case 'annoyed': return annoyedImage;
      case 'shocked': return shockedImage;
      case 'sleepy': return sleepyImage;
      default: return smileImage;
    }
  };
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [characterState, setCharacterState] = useState('smile');

  // Function to get random dialogue
  const getRandomDialogue = (isCorrect) => {
    const responses = isCorrect ? dialogueLines.positiveResponses : dialogueLines.negativeResponses;
    return responses[Math.floor(Math.random() * responses.length)];
  };

  // Get current question
  const question = questions.data[currentQuestion];
  //to use to ensure that the program doesn't skip to the next question automatically
  const donttype = useRef(false);
  //this is used to keep track of the state as the word if being typed
  const [typeString, setTypeString] = useState("");
  //this stores the actual dialogue line
  const [dialogue, setDialogue] = useState("Well, go ahead!");

  // Handle answer selection
  const handleAnswer = (selectedAnswer) => {
    if (selectedAnswer === question.correctAnswer) {
      setCharacterState('delighted');
      
      setTypeString("");
      let randDialogue = getRandomDialogue(true); //true yields positive responses
      setDialogue(randDialogue);
      donttype.current = true;
      
    } else {
      setCharacterState('annoyed');

      setTypeString("");
      let randDialogue = getRandomDialogue(false); //false yields negative responses
      setDialogue(randDialogue);
      donttype.current = true;
      
    }
    
    //move to next question
    if (currentQuestion < questions.data.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  // useType effect hook
  useType(dialogue, typeString, setTypeString);
  
  return (
    <div className="min-h-screen bg-black relative">
      {/* Background */}
      <img 
        src={backgroundImage} 
        alt="Background" 
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Main Content Container */}
      <div className="relative z-10 flex flex-row justify-evenly items-center min-h-screen p-8">
        {/* Question Section (Left) */}
        <div className="w-1/3 max-w-md bg-black/60 p-6 rounded-xl shadow-lg">
          <h2 className="text-2xl mb-4 text-white font-bold">Question {currentQuestion + 1}</h2>
          <p className="text-white mb-6 text-lg font-medium">{question.question}</p>
          <div className="space-y-3">
            {question.answerChoices.map((option, index) => (
              <button
                key={index}
                onClick={() => {
                  const isCorrect = option === question.correctAnswer;
                  const dialogue = getRandomDialogue(isCorrect);
                  setDialogue(dialogue);
                  handleAnswer(option);
                }}
                className="w-full p-3 bg-white/10 hover:bg-pink-400/30 rounded-lg text-white font-semibold transition-colors duration-100 cursor-pointer"
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        {/* Character Section (Right) */}
        <div className="w-1/3 max-w-md flex flex-col items-center relative">
          <img 
            src={getCharacterImage(characterState)} 
            alt="Character" 
            className="w-full h-auto drop-shadow-xl"
          />

          {/* Dialogue Section */}
          <div className="p-6 bg-black/60 rounded-xl shadow-lg w-full min-h-32">
            <p className='text-white text-lg'>
              {
                typeString
              }
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Game;
