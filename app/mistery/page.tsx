'use client';

import GameLoseFooter from "@/components/game-loose-footer";
import GameWinFooter from "@/components/game-win-footer";
import { Progress } from '@/components/ui/progress';
import { useCoupons } from "@/hooks/use-coupons";
import { Minus, Square, X } from "lucide-react";
import { useEffect, useState } from 'react';

interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: string;
  isOptional: boolean;
}

const allQuestions: Question[] = [
  {
    id: 1,
    question: "¿Cuándo fue nuestra primera cita?",
    options: ["13/2/19", "14/2/19", "12/2/19", "15/2/19"],
    correctAnswer: "13/2/19",
    isOptional: false
  },
  {
    id: 2,
    question: "¿Qué película vimos en nuestra primera cita?",
    options: ["Glass", "Split", "Unbreakable", "Signs"],
    correctAnswer: "Glass",
    isOptional: false
  },
  {
    id: 3,
    question: "¿En qué calle quedaba el lugar donde comimos sushi por primera vez?",
    options: ["Olazabal", "Cabildo", "Santa Fe", "Corrientes"],
    correctAnswer: "Olazabal",
    isOptional: false
  },
  {
    id: 4,
    question: "¿Nombre del parque de nuestra segunda cita?",
    options: ["Parque de la costa", "Temaikén", "Parque Centenario", "Parque Sarmiento"],
    correctAnswer: "Parque de la costa",
    isOptional: false
  },
  {
    id: 5,
    question: "¿En qué lugar de Buenos Aires te pedí la mano?",
    options: ["Lujan", "San Isidro", "Tigre", "Pilar"],
    correctAnswer: "Lujan",
    isOptional: false
  },
  {
    id: 6,
    question: "¿Cuántos besos nos hemos dado?",
    options: ["11000", "10000", "12000", "9000"],
    correctAnswer: "11000",
    isOptional: true
  },
  {
    id: 7,
    question: "¿Cuántos sobre nombres que empiezan por 'Mi amor cosita' te he dicho?",
    options: ["33", "30", "35", "40"],
    correctAnswer: "33",
    isOptional: false
  },
  {
    id: 8,
    question: "¿A cuántos lugares hemos ido a cenar?",
    options: ["900", "800", "1000", "700"],
    correctAnswer: "900",
    isOptional: true
  },
  {
    id: 9,
    question: "¿Cuántos kilómetros hemos recorrido juntos? Incluyendo auto y vuelos",
    options: ["50000", "45000", "55000", "60000"],
    correctAnswer: "50000",
    isOptional: true
  }
];

export default function TriviaPage() {
  const {markCouponAsWon} = useCoupons();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);

  useEffect(() => {
    if (gameStarted) {
      // Randomly select 5 questions
      const shuffled = [...allQuestions].sort(() => 0.5 - Math.random());
      setQuestions(shuffled.slice(0, 5));
      setCurrentQuestionIndex(0);
      setSelectedAnswer(null);
      setScore(0);
      setShowResults(false);
    }
  }, [gameStarted]);

  useEffect(() => {
    if (showResults) {
      const requiredQuestions = questions.filter(q => !q.isOptional).length;
      const requiredCorrect = questions.filter(q => !q.isOptional && q.correctAnswer === selectedAnswer).length;
      const isWinner = requiredCorrect === requiredQuestions;
      
      if (isWinner) {
        markCouponAsWon(3);
      }
    }
  }, [showResults, questions, selectedAnswer, markCouponAsWon]);

  const handleAnswerSelect = (answer: string) => {
    setSelectedAnswer(answer);
  };

  const handleNext = () => {
    if (selectedAnswer) {
      const currentQuestion = questions[currentQuestionIndex];
      if (selectedAnswer === currentQuestion.correctAnswer) {
        setScore(prev => prev + 1);
      }

      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(prev => prev + 1);
        setSelectedAnswer(null);
      } else {
        setShowResults(true);
      }
    }
  };

  const handleRestart = () => {
    setGameStarted(false);
  };

  if (!gameStarted) {
    return (
      <div className="w-full max-w-2xl relative z-10 mx-auto mt-8">
        <div className="retro-window">
          <div className="retro-window-title">
            <span>Trivia de Nuestro Amor</span>
            <div className="flex gap-1">
              <button className="p-1 hover:bg-white/10 rounded">
                <Minus size={12} />
              </button>
              <button className="p-1 hover:bg-white/10 rounded">
                <Square size={12} />
              </button>
              <button className="p-1 hover:bg-white/10 rounded">
                <X size={12} />
              </button>
            </div>
          </div>
          <div className="retro-window-content">
            <div className="relative w-full h-[400px] bg-kawaii-pink-100 rounded-lg overflow-hidden flex flex-col items-center justify-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 special-text">¡Responde las preguntas sobre nuestro amor!</h2>
              <button
                onClick={() => setGameStarted(true)}
                className="pixel-button"
              >
                Empezar
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="w-full max-w-2xl relative z-10 mx-auto mt-8">
        <div className="retro-window">
          <div className="retro-window-title">
            <span>Trivia de Nuestro Amor</span>
            <div className="flex gap-1">
              <button className="p-1 hover:bg-white/10 rounded">
                <Minus size={12} />
              </button>
              <button className="p-1 hover:bg-white/10 rounded">
                <Square size={12} />
              </button>
              <button className="p-1 hover:bg-white/10 rounded">
                <X size={12} />
              </button>
            </div>
          </div>
          <div className="retro-window-content">
            <div className="relative w-full h-[400px] bg-kawaii-pink-100 rounded-lg overflow-hidden flex flex-col items-center justify-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 special-text">Cargando...</h2>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (showResults) {
    const requiredQuestions = questions.filter(q => !q.isOptional).length;
    const requiredCorrect = questions.filter(q => !q.isOptional && q.correctAnswer === selectedAnswer).length;
    const isWinner = requiredCorrect === requiredQuestions;

    return (
      <div className="w-full max-w-2xl relative z-10 mx-auto mt-8">
        <div className="retro-window">
          <div className="retro-window-title">
            <span>Trivia de Nuestro Amor</span>
            <div className="flex gap-1">
              <button className="p-1 hover:bg-white/10 rounded">
                <Minus size={12} />
              </button>
              <button className="p-1 hover:bg-white/10 rounded">
                <Square size={12} />
              </button>
              <button className="p-1 hover:bg-white/10 rounded">
                <X size={12} />
              </button>
            </div>
          </div>
          <div className="retro-window-content">
            <div className="relative w-full h-[400px] bg-kawaii-pink-100 rounded-lg overflow-hidden flex flex-col items-center justify-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 special-text">
                {isWinner ? "¡Felicitaciones! ¡Ganaste! 🎉" : "¡Casi lo logras! Intenta de nuevo 💪"}
              </h2>
              <p className="text-center mb-4 text-gray-700">
                Respondiste correctamente {score} de {questions.length} preguntas
              </p>
              {isWinner && (
                <GameWinFooter score={1000} label="una cena romántica" />
              )}
              {!isWinner && (
                <GameLoseFooter onRestart={handleRestart} />
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  return (
    <div className="w-full max-w-2xl relative z-10 mx-auto mt-8">
      <div className="retro-window">
        <div className="retro-window-title">
          <span>Trivia de Nuestro Amor</span>
          <div className="flex gap-1">
            <button className="p-1 hover:bg-white/10 rounded">
              <Minus size={12} />
            </button>
            <button className="p-1 hover:bg-white/10 rounded">
              <Square size={12} />
            </button>
            <button className="p-1 hover:bg-white/10 rounded">
              <X size={12} />
            </button>
          </div>
        </div>
        <div className="retro-window-content">
          <div className="relative w-full h-[400px] bg-kawaii-pink-100 rounded-lg overflow-hidden flex flex-col items-center justify-center p-4">
            <Progress value={progress} className="mb-6 w-full" />
            <h2 className="text-xl font-bold mb-4 text-gray-900">
              Pregunta {currentQuestionIndex + 1} de {questions.length}
            </h2>
            <p className="text-lg mb-6 text-gray-700 text-center">{currentQuestion.question}</p>
            {currentQuestion.isOptional && (
              <p className="text-sm text-kawaii-pink-600 mb-4 hidden">(Esta pregunta es opcional)</p>
            )}
            <div className="grid grid-cols-2 gap-3 w-full max-w-md">
              {currentQuestion.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(option)}
                  className={`w-full text-left p-3 rounded-lg transition-all duration-300 border-2 ${
                    selectedAnswer === option
                      ? 'bg-kawaii-pink-600 text-white border-kawaii-pink-700'
                      : 'bg-white text-gray-700 hover:bg-kawaii-pink-50 border-kawaii-pink-200'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
            <button
              onClick={handleNext}
              disabled={!selectedAnswer}
              className="pixel-button mt-6"
            >
              {currentQuestionIndex === questions.length - 1 ? 'Ver resultados' : 'Siguiente'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 