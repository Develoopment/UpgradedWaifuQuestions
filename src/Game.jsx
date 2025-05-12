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
  // Function to get a random character image based on state
  const getCharacterImage = (state) => {
    const images = {
      correct: [delightedImage, shockedImage, smileImage],
      incorrect: [annoyedImage, sleepyImage]
    };
    
    const imageSet = state ? images.correct : images.incorrect;
    const randomIndex = Math.floor(Math.random() * imageSet.length);
    return imageSet[randomIndex];
  };
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [characterState, setCharacterState] = useState(smileImage);

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
    const isCorrect = selectedAnswer === question.correctAnswer;
    const dialogue = getRandomDialogue(isCorrect);
    
    // Update state only once
    setCharacterState(getCharacterImage(isCorrect));
    setDialogue(dialogue);
    
    // Reset typing
    setTypeString("");
    donttype.current = true;
    
    //move to next question
    if (currentQuestion < questions.data.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  // useType effect hook
  useType(dialogue, typeString, setTypeString);
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 relative">
      {/* Background */}
      <img 
        src={backgroundImage} 
        alt="Background" 
        className="absolute inset-0 w-full h-full object-cover opacity-30"
      />

      {/* Main Content Container */}
      <div className="relative z-10 flex flex-row justify-center items-center min-h-screen p-8 space-x-18">
        {/* Question Section (Left) */}
        <div className="w-1/3 max-w-md bg-pink-100 p-6 rounded-2xl shadow-lg border-4 border-pink-300 animate-float">
          <h2 className="text-2xl mb-4 text-pink-800 font-bold text-shadow-md">Question {currentQuestion + 1}</h2>
          <p className="text-pink-800 mb-6 text-lg font-medium text-shadow-sm">{question.question}</p>
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
                className="w-full p-3 bg-pink-200 hover:bg-pink-300 rounded-2xl text-pink-800 font-semibold transition-all duration-200 transform hover:scale-105 cursor-pointer border-2 border-pink-300"
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        {/* Character Section (Right) */}
        <div className="w-1/3 max-w-md flex flex-col items-center relative bg-purple-50 rounded-2xl p-4 shadow-lg animate-float">
          <img 
            src={characterState} 
            alt="Character" 
            className="w-full h-auto drop-shadow-xl rounded-2xl"
          />

          {/* Dialogue Section */}
          <div className="p-6 bg-pink-200 rounded-2xl shadow-lg w-full min-h-32 animate-float relative overflow-hidden">
            <p className='text-white text-lg text-shadow-sm relative z-10'>
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
