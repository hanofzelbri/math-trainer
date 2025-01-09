import { useState, useEffect } from 'react'
import { Button } from "./ui/button"

type ProblemType = 'regular' | 'findX';

interface MathTrainerProps {
    onProblemComplete: (isFirstTry: boolean, streak: number) => void;
    allowedNumbers: number[];
}

export function MathTrainer({ onProblemComplete, allowedNumbers }: MathTrainerProps) {
    const [currentProblem, setCurrentProblem] = useState('')
    const [options, setOptions] = useState<number[]>([])
    const [correctAnswer, setCorrectAnswer] = useState(0)
    const [wrongAnswers, setWrongAnswers] = useState<number[]>([])
    const [isAnswerCorrect, setIsAnswerCorrect] = useState(false)
    const [firstTryStreak, setFirstTryStreak] = useState(0)

    const getRandomNumber = () => {
        const randomIndex = Math.floor(Math.random() * allowedNumbers.length);
        return allowedNumbers[randomIndex];
    };

    const generateMultiplicationProblem = (type: ProblemType) => {
        const num1 = getRandomNumber()
        const num2 = getRandomNumber()
        const result = num1 * num2

        if (type === 'regular') {
            setCurrentProblem(`${num1} × ${num2} = <span class="text-primary">?</span>`)
            setCorrectAnswer(result)
            return result
        } else {
            const isFirstNumberX = Math.random() < 0.5
            if (isFirstNumberX) {
                setCurrentProblem(`<span class="text-primary">?</span> × ${num2} = ${result}`)
                setCorrectAnswer(num1)
                return num1
            } else {
                setCurrentProblem(`${num1} × <span class="text-primary">?</span> = ${result}`)
                setCorrectAnswer(num2)
                return num2
            }
        }
    }

    const generateDivisionProblem = (type: ProblemType) => {
        const divisor = getRandomNumber()
        const quotient = getRandomNumber()
        const dividend = divisor * quotient

        if (type === 'regular') {
            setCurrentProblem(`${dividend} ÷ ${divisor} = <span class="text-primary">?</span>`)
            setCorrectAnswer(quotient)
            return quotient
        } else {
            const isDividendX = Math.random() < 0.5
            if (isDividendX) {
                setCurrentProblem(`<span class="text-primary">?</span> ÷ ${divisor} = ${quotient}`)
                setCorrectAnswer(dividend)
                return dividend
            } else {
                setCurrentProblem(`${dividend} ÷ <span class="text-primary">?</span> = ${quotient}`)
                setCorrectAnswer(divisor)
                return divisor
            }
        }
    }

    const generateProblem = () => {
        const isMultiplication = Math.random() < 0.5
        const isRegular = Math.random() < 0.5
        const type: ProblemType = isRegular ? 'regular' : 'findX'

        setWrongAnswers([])
        setIsAnswerCorrect(false)

        const answer = isMultiplication
            ? generateMultiplicationProblem(type)
            : generateDivisionProblem(type)

        generateOptions(answer)
    }

    const generateOptions = (answer: number) => {
        const optionsSet = new Set<number>()
        optionsSet.add(answer)

        const maxValue = Math.max(...allowedNumbers) * Math.max(...allowedNumbers)
        while (optionsSet.size < 4) {
            const randomAnswer = Math.floor(Math.random() * maxValue) + 1
            if (randomAnswer !== answer) {
                optionsSet.add(randomAnswer)
            }
        }

        setOptions(Array.from(optionsSet).sort(() => Math.random() - 0.5))
    }

    const checkAnswer = (selectedAnswer: number) => {
        if (selectedAnswer === correctAnswer) {
            setIsAnswerCorrect(true)
            const isFirstTry = wrongAnswers.length === 0

            if (isFirstTry) {
                setFirstTryStreak(prev => prev + 1)
            } else {
                setFirstTryStreak(0)
            }

            onProblemComplete(isFirstTry, isFirstTry ? firstTryStreak + 1 : 0)

            setTimeout(() => {
                generateProblem()
            }, 500)
        } else {
            setWrongAnswers([...wrongAnswers, selectedAnswer])
        }
    }

    const getButtonVariant = (option: number) => {
        if (option === correctAnswer && isAnswerCorrect) return "default"
        if (wrongAnswers.includes(option)) return "destructive"
        return "outline"
    }

    const getButtonStyle = (option: number) => {
        if (option === correctAnswer && isAnswerCorrect) {
            return "bg-green-500 hover:bg-green-600 text-white"
        }
        return ""
    }

    useEffect(() => {
        generateProblem()
    }, [])

    return (
        <div className="text-center mb-8">
            <div className="text-5xl font-bold mb-8" dangerouslySetInnerHTML={{ __html: currentProblem }}></div>
            <div className="grid grid-cols-2 gap-4">
                {options.map((option, index) => (
                    <Button
                        key={index}
                        variant={getButtonVariant(option)}
                        size="lg"
                        className={`text-xl p-8 ${getButtonStyle(option)}`}
                        onClick={() => checkAnswer(option)}
                        disabled={isAnswerCorrect || wrongAnswers.includes(option)}
                    >
                        {option}
                    </Button>
                ))}
            </div>
        </div>
    )
} 
