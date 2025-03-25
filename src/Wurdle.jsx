import React, { useState, useEffect } from 'react';

const API_URL = "/api/api/fe/wordle-words"; // Fixed API URL

function Wurdle() {
    const [solution, setSolution] = useState("");
    const [guesses, setGuesses] = useState(Array(6).fill(null));
    const [currentGuess, setCurrentGuess] = useState("");
    const [isGameOver, setIsGameOver] = useState(false);

    useEffect(() => {
        const handleType = (event) => {
            if (isGameOver) return;

            if (event.key === 'Enter') {
                if (currentGuess.length !== 5) return;

                const newGuesses = [...guesses];
                const guessIndex = guesses.findIndex(val => val == null);
                if (guessIndex !== -1) newGuesses[guessIndex] = currentGuess.toUpperCase();

                setGuesses(newGuesses);
                setCurrentGuess("");

                if (solution === currentGuess.toUpperCase()) setIsGameOver(true);
                return;
            }

            if (event.key === 'Backspace') {
                setCurrentGuess(prev => prev.slice(0, -1));
                return;
            }

            if (/^[a-zA-Z]$/.test(event.key) && currentGuess.length < 5) {
                setCurrentGuess(prev => prev + event.key.toUpperCase());
            }
        };

        window.addEventListener('keydown', handleType);
        return () => window.removeEventListener('keydown', handleType);
    }, [currentGuess, isGameOver, solution,guesses]);

    useEffect(() => {
        const fetchWord = async () => {
            try {
                const response = await fetch(API_URL);
                if (!response.ok) throw new Error("Failed to fetch");

                const words = await response.json();
                const randomWord = words[Math.floor(Math.random() * words.length)];
                setSolution(randomWord.toUpperCase());
            } catch (error) {
                console.error("Error fetching word:", error);
            }
        };
        fetchWord();
    }, []);

    return (
        <div className='board'>
            {guesses.map((guess, i) => {
                const isCurrentGuess = i === guesses.findIndex(val => val == null);
                return (
                    <Line key={i} 
                        guess={isCurrentGuess ? currentGuess : guess ?? ""} 
                        isFinal={!isCurrentGuess && guess != null} 
                        solution={solution} 
                    />
                );
                
            })}
            <div className="game-message">
                {(isGameOver && guesses[0] !== null) ? "You won!" : "Keep trying!"}
            </div>
            
        </div>
    );
}

export default Wurdle;

function Line({ guess, isFinal, solution }) {
    return (
        <div className='Line'>
            {Array.from({ length: 5 }).map((_, i) => {
                const char = guess[i] || "";
                let className = "tile";

                if (isFinal) {
                    if (char === solution[i]) {
                        className += " correct";
                    } else if (solution.includes(char)) {
                        className += " close";
                    } else {
                        className += " incorrect";
                    }
                }

                return <div key={i} className={className}>{char}</div>;
            })}
        </div>
    );
}
