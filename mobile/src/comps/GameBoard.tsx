import { View, Pressable } from "react-native";
import { styled } from 'nativewind';
import { useGameContext } from '../../context/GameContext';
import { SvgXml } from 'react-native-svg';
import type { Card, GameData } from '../../types';

const StyledView = styled(View);
const StyledPressable = styled(Pressable)
const StyledSvgXml = styled(SvgXml);

export default function GameBoard() {
  const { gameData, setGameData } = useGameContext();

  // Select card logic
  const handleSelect = (id : string): void => {
    // If the id is present, filter it
    if (gameData.selectedCards.includes(id)) {
      // React unlike Vue, has immutable states, which have to be cloned to be updated
      setGameData((gameData: GameData) => ({
        ...gameData, 
        selectedCards: gameData.selectedCards.filter((cardId: string) => cardId !== id)
      }))

    // If it's not present, spread and push it
    } else if (gameData.selectedCards.length < 3) {
      const newCards = [...gameData.selectedCards, id];
  
      setGameData((gameData: GameData) => ({
        ...gameData,
        selectedCards: newCards
      }));
    
      if (newCards.length === 3) {
        // await validateSet(newCards);
      }
    }
  }

  // Helper function to generate card class names based on card state
  function getCardClasses(cardId: string): string {
    const baseClasses = "border-4 rounded-lg mx-4 my-5 flex justify-center items-center bg-white py-1";
  
    const selectedBorder = gameData.selectedCards.includes(cardId) 
      ? 'border-green-600' 
      : 'border-black';
  
    // The last border might be overriding the selected border
    // Consider removing the 'border-black' fallbacks
    const autoFoundBorder = gameData.autoFoundSet.includes(cardId) && !gameData.selectedCards.includes(cardId)
      ? 'border-orange-400'
      : ''; // Remove border-black here
  
    return `${baseClasses} ${selectedBorder} ${autoFoundBorder}`.trim();
  }

  // Unforutnately React Native does not support CSS Grid
  const rows = gameData.boardFeed.reduce((acc, card, i) => {
    const rowIndex = Math.floor(i / 4);
    acc[rowIndex] = acc[rowIndex] || [];
    acc[rowIndex].push(card);
    return acc;
  }, [] as Card[][]);

  return (
    <StyledView className="flex-1 justify-center items-center bg-purple-500 py-5">
      {rows.map((row, rowIndex) => (
        <StyledView key={rowIndex} className="flex flex-row justify-center flex-1">
          {row.map((card: Card, index: number) => (
            <StyledPressable 
              onPress={() => handleSelect(card._id)}
              key={index}
              style={{ transform: [{ scale: 1.2 }] }}
              className={getCardClasses(card._id)}
            >
              <StyledSvgXml 
                xml={String.fromCharCode(...card.image.data)}
                width={100}
                height={140}
                preserveAspectRatio="xMidYMid meet"
                className="bg-white"
              />
            </StyledPressable>
          ))}
        </StyledView>
      ))}
    </StyledView>
  );
}
