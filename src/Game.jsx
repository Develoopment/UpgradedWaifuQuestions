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

// Import ending screens
import winScreenImage from './assets/endings/win_screen.jpg';
import failureImage from './assets/endings/failure.jpg';

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
  
  // Game state
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [characterState, setCharacterState] = useState(smileImage);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [isWinner, setIsWinner] = useState(false);
  
  // Score threshold for winning
  const SCORE_THRESHOLD = 2; // Adjust this value as needed

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
    
    // Update score if answer is correct
    if (isCorrect) {
      setScore(score + 1);
    }
    
    // Reset typing
    setTypeString("");
    donttype.current = true;
    
    // Move to next question or end game
    if (currentQuestion < questions.data.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Game is over, determine ending
      setIsWinner(score + (isCorrect ? 1 : 0) >= SCORE_THRESHOLD);
      setGameOver(true);
    }
  };
  
  // Reset game to play again
  const resetGame = () => {
    setCurrentQuestion(0);
    setCharacterState(smileImage);
    setScore(0);
    setGameOver(false);
    setIsWinner(false);
    setDialogue("Well, go ahead!");
    setTypeString("");
  };

  // useType effect hook
  useType(dialogue, typeString, setTypeString);
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 relative">
      {/* Background - changes based on game state */}
      <img 
        src={gameOver ? (isWinner ? winScreenImage : failureImage) : backgroundImage} 
        alt={gameOver ? (isWinner ? "Victory Background" : "Failure Background") : "Background"} 
        className="absolute inset-0 w-full h-full object-cover" 
        style={{ opacity: gameOver ? 0.9 : 0.3 }}
      />

      {/* Main Content Container */}
      <div className="relative z-10 flex flex-row justify-center items-center min-h-screen p-8 space-x-18">
        {gameOver ? (
          /* Game Over Screen */
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <h2 className="text-3xl mb-4 font-bold text-white text-shadow-lg">
              {isWinner ? "Congratulations!" : "Better luck next time!"}
            </h2>
            <p className="text-lg mb-6 text-white text-shadow-lg">
              {isWinner 
                ? "You've proven yourself to be a true anime fan!" 
                : "Looks like you need to brush up on your anime knowledge."}
            </p>
            <p className="text-md mb-12 text-white text-shadow-lg">
              Your score: {score} / {questions.data.length}
            </p>
            <button
              onClick={resetGame}
              className="px-6 py-3 bg-pink-400 hover:bg-pink-500 text-white font-bold rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg"
            >
              Play Again
            </button>
          </div>
        ) : (
          /* Game Screen */
          <>
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
                <p className='text-purple-800 text-lg text-shadow-sm relative z-10'>
                  {
                    typeString
                  }
                </p>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Game;
