"use client";

import { useEffect, useState } from "react";
import styles from "@/styles/page.module.scss";
import confetti from 'canvas-confetti';

export default function Home() {
  const [tiles, setTiles] = useState<(number | null)[]>([]);
  const [emptyIndex, setEmptyIndex] = useState(15);
  const [isCompleted, setIsCompleted] = useState(false);
  const [moveCount, setMoveCount] = useState(0);
  const [hasShuffled, setHasShuffled] = useState(false);
  const [lastShuffleDate, setLastShuffleDate] = useState<string | null>(null);

  useEffect(() => {
    try {
      const savedState = localStorage.getItem('puzzleState');
      if (savedState) {
        const parsedState = JSON.parse(savedState);
        const { 
          hasShuffled: savedHasShuffled, 
          lastShuffleDate: savedDate,
          tiles: savedTiles,
          emptyIndex: savedEmptyIndex,
          moveCount: savedMoveCount
        } = parsedState;
        
        const today = new Date().toISOString().split('T')[0];
        
        // Set shuffle state regardless of date
        if (savedDate === today) {
          setHasShuffled(savedHasShuffled || false);
          setLastShuffleDate(savedDate);
        }
        
        // Always restore game state if available
        if (savedTiles && Array.isArray(savedTiles) && savedTiles.length === 16) {
          setTiles(savedTiles);
          setEmptyIndex(typeof savedEmptyIndex === 'number' ? savedEmptyIndex : 15);
          setMoveCount(typeof savedMoveCount === 'number' ? savedMoveCount : 0);
          
          // Check if the board is already in completed state
          const isInOrder = savedTiles.slice(0, -1).every((num, index) => num === index + 1);
          const isLastEmpty = savedTiles[savedTiles.length - 1] === null;
          setIsCompleted(isInOrder && isLastEmpty);
          
          return; // Skip initializeGame if we restored the state
        }
      }
    } catch (error) {
      console.error("Error loading saved game state:", error);
      // Continue to initialize a new game if there's an error
    }
    
    // Only initialize a new game if we couldn't restore from localStorage
    initializeGame();
  }, []);

  function saveGameState(
    tiles: (number | null)[], 
    emptyIndex: number, 
    moveCount: number,
    hasShuffled: boolean = false,
    lastShuffleDate: string | null = null
  ) {
    localStorage.setItem('puzzleState', JSON.stringify({
      tiles,
      emptyIndex,
      moveCount,
      hasShuffled,
      lastShuffleDate
    }));
  }

  useEffect(() => {
    if (tiles.length === 0) return;
    
    const isInOrder = tiles.slice(0, -1).every((num, index) => num === index + 1);
    const isLastEmpty = tiles[tiles.length - 1] === null;
    
    if (isInOrder && isLastEmpty && !isCompleted) {
      setIsCompleted(true);
      triggerConfetti();
    }
  }, [tiles, isCompleted]);

  function initializeGame() {
    const newTiles: (number | null)[] = Array.from({ length: 15 }, (_, i) => i + 1);
    newTiles.push(null);
    
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
    
    setTiles(newTiles);
    setEmptyIndex(currentEmptyIndex);
    setMoveCount(0);
    setIsCompleted(false);
  }

  function moveTile(index: number) {
    if (isCompleted) return;
    
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
      setMoveCount(prev => prev + 1);
      
      saveGameState(newTiles, index, moveCount + 1);
    }
  }

  function shuffleBoard() {
    const today = new Date().toISOString().split('T')[0];
    
    if (hasShuffled && lastShuffleDate === today) {
      return;
    }
  
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
    
    const todayDate = new Date().toISOString().split('T')[0];
    setTiles(newTiles);
    setEmptyIndex(currentEmptyIndex);
    setMoveCount(0);
    setIsCompleted(false);
    setHasShuffled(true);
    setLastShuffleDate(todayDate);
    
    saveGameState(newTiles, currentEmptyIndex, 0, true, todayDate);
  }

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

  function isValidMoveForShuffle(index: number, currentEmpty: number) {
    if (index % 4 === 3 && currentEmpty % 4 === 0) return false;
    if (index % 4 === 0 && currentEmpty % 4 === 3) return false;
    return true;
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Quebra-Cabeça Deslizante</h1>
      <p className={styles.moveCounter}>Movimentos: {moveCount}</p>
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
        disabled={!isCompleted && hasShuffled && lastShuffleDate === new Date().toISOString().split('T')[0]}
      >
        {isCompleted ? 'Jogar Novamente' : 'Embaralhar'}
      </button>
    </div>
  );
}
