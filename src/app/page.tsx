"use client";

import { useEffect, useState } from "react";
import styles from "@/styles/page.module.scss";
import confetti from 'canvas-confetti';

export default function Home() {
  const [tiles, setTiles] = useState<(number | null)[]>([]);
  const [emptyIndex, setEmptyIndex] = useState(15);
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    // Initialize the board and shuffle it immediately
    initializeGame();
  }, []);

  // Verifica se o quebra-cabeça está completo
  useEffect(() => {
    if (tiles.length === 0) return;
    
    const isInOrder = tiles.slice(0, -1).every((num, index) => num === index + 1);
    const isLastEmpty = tiles[tiles.length - 1] === null;
    
    if (isInOrder && isLastEmpty && !isCompleted) {
      setIsCompleted(true);
      triggerConfetti();
    }
  }, [tiles, isCompleted]);

  // Initialize game with shuffled board
  function initializeGame() {
    // Create a shuffled board directly instead of creating ordered then shuffling
    const newTiles: (number | null)[] = Array.from({ length: 15 }, (_, i) => i + 1);
    newTiles.push(null);
    
    // Shuffle the tiles before setting state
    let currentEmptyIndex = 15;
    
    for (let i = 0; i < 100; i++) {
      const neighbors = [
        currentEmptyIndex - 4, 
        currentEmptyIndex + 4, 
        currentEmptyIndex - 1, 
        currentEmptyIndex + 1
      ].filter(i => i >= 0 && i < 16 && isValidMoveForShuffle(i, currentEmptyIndex));
      
      const randomIndex = neighbors[Math.floor(Math.random() * neighbors.length)];
      [newTiles[currentEmptyIndex], newTiles[randomIndex]] = [newTiles[randomIndex], newTiles[currentEmptyIndex]];
      currentEmptyIndex = randomIndex;
    }
    
    // Set state only after shuffling
    setTiles(newTiles);
    setEmptyIndex(currentEmptyIndex);
    setIsCompleted(false);
  }

  function moveTile(index: number) {
    if (isCompleted) return; // Impede movimentos após completar
    
    const possibleMoves = [
      emptyIndex - 4,
      emptyIndex + 4,
      emptyIndex - 1,
      emptyIndex + 1
    ];
  
    if (possibleMoves.includes(index) && isValidMove(index)) {
      const newTiles = [...tiles];
      [newTiles[emptyIndex], newTiles[index]] = [newTiles[index], newTiles[emptyIndex]];
      setTiles(newTiles);
      setEmptyIndex(index);
    }
  }

  // Função para disparar o efeito de confete
  function triggerConfetti() {
    confetti({
      particleCount: 200,
      spread: 70,
      origin: { y: 0.6 }
    });
  }

  function isValidMove(index: number) {
    if (index % 4 === 3 && emptyIndex % 4 === 0) return false;
    if (index % 4 === 0 && emptyIndex % 4 === 3) return false;
    return true;
  }

  function shuffleBoard() {
    // Reset completion state when shuffling
    setIsCompleted(false);
    
    let currentEmptyIndex = emptyIndex;
    const newTiles = [...tiles];

    for (let i = 0; i < 100; i++) {
      const neighbors = [
        currentEmptyIndex - 4, 
        currentEmptyIndex + 4, 
        currentEmptyIndex - 1, 
        currentEmptyIndex + 1
      ].filter(i => i >= 0 && i < 16 && isValidMoveForShuffle(i, currentEmptyIndex));
      
      const randomIndex = neighbors[Math.floor(Math.random() * neighbors.length)];
      [newTiles[currentEmptyIndex], newTiles[randomIndex]] = [newTiles[randomIndex], newTiles[currentEmptyIndex]];
      currentEmptyIndex = randomIndex;
    }
    
    setTiles(newTiles);
    setEmptyIndex(currentEmptyIndex);
  }

  function isValidMoveForShuffle(index: number, currentEmpty: number) {
    if (index % 4 === 3 && currentEmpty % 4 === 0) return false;
    if (index % 4 === 0 && currentEmpty % 4 === 3) return false;
    return true;
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Quebra-Cabeça Deslizante</h1>
      <div className={styles.gameBoard}>
        {tiles.map((num, i) => (
          <div 
            key={i}
            className={`${styles.tile} ${num === null ? styles.empty : ''} ${isCompleted ? styles.completed : ''}`}
            onClick={() => num !== null ? moveTile(i) : null}
          >
            {num}
          </div>
        ))}
      </div>
      
      {isCompleted && (
        <div className={styles.congratsMessage}>
          <h2>Parabéns!</h2>
          <p>Você completou o quebra-cabeça!</p>
        </div>
      )}
      
      <button 
        className={styles.shuffleButton} 
        onClick={isCompleted ? initializeGame : shuffleBoard}
      >
        {isCompleted ? 'Jogar Novamente' : 'Embaralhar'}
      </button>
    </div>
  );
}
