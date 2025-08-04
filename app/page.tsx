"use client"
import React, { useState, useEffect, useCallback, useMemo } from 'react';

// Types
type PlayerId = 'N' | 'S';

interface Character {
  name: string;
}

type CustomIcons = Record<string, string>; // character name -> base64 data URL

interface HistoryEntry {
  characterName: string;
  timestamp: number;
}

// Constants
const CHARACTER_ROSTER: Character[] = [
  { name: 'Adam Warlock' },
  { name: 'Black Panther' },
  { name: 'Black Widow' },
  { name: 'Captain America' },
  { name: 'Cloak & Dagger' },
  { name: 'Doctor Strange' },
  { name: 'Emma Frost' },
  { name: 'Groot' },
  { name: 'Hawkeye' },
  { name: 'Hela' },
  { name: 'Hulk' },
  { name: 'Human Torch' },
  { name: 'Invisible Woman' },
  { name: 'Iron Fist' },
  { name: 'Iron Man' },
  { name: 'Jeff the Land Shark' },
  { name: 'Loki' },
  { name: 'Luna Snow' },
  { name: 'Magik' },
  { name: 'Magneto' },
  { name: 'Mantis' },
  { name: 'Mister Fantastic' },
  { name: 'Moon Knight' },
  { name: 'Namor' },
  { name: 'Peni Parker' },
  { name: 'Phoenix' },
  { name: 'Psylocke' },
  { name: 'The Punisher' },
  { name: 'The Thing' },
  { name: 'Rocket Raccoon' },
  { name: 'Scarlet Witch' },
  { name: 'Squirrel Girl' },
  { name: 'Spider-Man' },
  { name: 'Star-Lord' },
  { name: 'Storm' },
  { name: 'Thor' },
  { name: 'Ultron' },
  { name: 'Venom' },
  { name: 'Winter Soldier' },
  { name: 'Wolverine' },
].sort((a, b) => a.name.localeCompare(b.name));

const PLAYER_CONFIG = {
  N: {
    name: "Niko",
    color: "cyan",
    textColor: "text-cyan-400",
    borderColor: "border-cyan-400",
    buttonClasses: "bg-cyan-500/20 border-cyan-500 hover:bg-cyan-500/40 hover:text-cyan-300",
    glow: "text-glow-cyan",
    slotShadow: "slot-shadow-cyan",
  },
  S: {
    name: "Safwan",
    color: "orange",
    textColor: "text-orange-400",
    borderColor: "border-orange-400",
    buttonClasses: "bg-orange-500/20 border-orange-500 hover:bg-orange-500/40 hover:text-orange-300",
    glow: "text-glow-orange",
    slotShadow: "slot-shadow-orange",
  }
};

// Utility Functions
const useLocalStorage = <T,>(key: string, initialValue: T): [T, React.Dispatch<React.SetStateAction<T>>] => {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      if (typeof window !== 'undefined') {
        const item = window.localStorage.getItem(key);
        return item ? JSON.parse(item) : initialValue;
      }
      return initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  const setValue = useCallback((value: React.SetStateAction<T>) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  }, [key, storedValue]);

  return [storedValue, setValue];
};

const processImage = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

// Components
const Button: React.FC<{
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  variant?: 'primary' | 'secondary';
}> = ({ children, onClick, disabled = false, className = '', variant = 'primary' }) => {
  const baseClasses = 'px-4 py-2 text-sm md:text-base font-bold uppercase tracking-wider border-2 rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variantClasses = {
    primary: '',
    secondary: 'bg-gray-700/50 border-gray-600 hover:bg-gray-700/80 hover:text-white',
  };

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

const Modal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title: string;
}> = ({ isOpen, onClose, children, title }) => {
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleEsc);
      return () => window.removeEventListener('keydown', handleEsc);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div 
        className="relative w-11/12 max-w-4xl max-h-[90vh] bg-gray-800/80 border-2 border-gray-600 rounded-lg shadow-2xl flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        <header className="flex items-center justify-between p-4 border-b-2 border-gray-700">
          <h2 className="text-xl font-bold tracking-widest uppercase text-gray-300">{title}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </header>
        <div className="overflow-y-auto p-4 md:p-6">
          {children}
        </div>
      </div>
    </div>
  );
};

const SlotReel: React.FC<{
  character: Character | null;
  customIcons: CustomIcons;
  isCenter: boolean;
}> = ({ character, customIcons, isCenter }) => {
  const iconSize = 'w-12 h-12 md:w-14 md:h-14';

  const renderCharacterIcon = (char: Character) => {
    const iconData = customIcons[char.name];
    if (iconData) {
      return <img src={iconData} alt={char.name} className={`${iconSize} object-cover rounded-md`} />;
    }
    const initials = char.name.split(' ').map(n => n[0]).join('').substring(0, 2);
    return (
      <div className={`${iconSize} bg-gray-700 flex items-center justify-center rounded-md text-lg font-bold`}>
        {initials}
      </div>
    );
  };

  return (
    <div className="h-20 flex items-center justify-center">
       {character ? renderCharacterIcon(character) : (
         isCenter && <span className="text-3xl font-bold text-gray-500">?</span>
       )}
    </div>
  );
};

const SlotMachine: React.FC<{
  isSpinning: boolean;
  targetCharacter: Character | null;
  availableCharacters: Character[];
  customIcons: CustomIcons;
  onSpinEnd: () => void;
  theme: 'cyan' | 'orange';
}> = ({ isSpinning, targetCharacter, availableCharacters, customIcons, onSpinEnd, theme }) => {
  const [visibleChars, setVisibleChars] = useState<(Character | null)[]>([null, null, null]);
  const config = PLAYER_CONFIG[theme === 'cyan' ? 'N' : 'S'];
  const fallbackCharacter: Character = { name: '?' };

  const shuffleArray = <T,>(array: T[]): T[] => {
    if (array.length === 0) return [];
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  useEffect(() => {
    let animationFrameId: number;

    if (!isSpinning) {
      if (targetCharacter) {
        const sideChars = shuffleArray(CHARACTER_ROSTER.filter(c => c.name !== targetCharacter.name));
        setVisibleChars([sideChars[0] || fallbackCharacter, targetCharacter, sideChars[1] || fallbackCharacter]);
      } else {
        setVisibleChars([null, null, null]);
      }
      return;
    }

    if (isSpinning && targetCharacter) {
      const baseReel = shuffleArray(availableCharacters.length > 2 ? availableCharacters : CHARACTER_ROSTER);
      const animationReel = [...baseReel, ...baseReel, ...baseReel];

      const finalRight = shuffleArray(baseReel.filter(c => c.name !== targetCharacter.name))[0] || fallbackCharacter;
      const finalLeft = shuffleArray(baseReel.filter(c => c.name !== targetCharacter.name && c.name !== finalRight.name))[0] || fallbackCharacter;
      const finalState = [finalLeft, targetCharacter, finalRight];

      let startTime: number | null = null;
      let lastUpdateTime = 0;
      let reelIndex = 0;
      const SPIN_DURATION_MS = 3000;

      const animate = (timestamp: number) => {
        if (!startTime) startTime = timestamp;
        const elapsedTime = timestamp - startTime;

        const slowDownFactor = Math.pow(elapsedTime / SPIN_DURATION_MS, 2);
        const updateInterval = 50 + (150 * slowDownFactor);

        if (timestamp - lastUpdateTime > updateInterval) {
          lastUpdateTime = timestamp;
          const left = animationReel[reelIndex % animationReel.length];
          const center = animationReel[(reelIndex + 1) % animationReel.length];
          const right = animationReel[(reelIndex + 2) % animationReel.length];
          setVisibleChars([left, center, right]);
          reelIndex++;
        }

        if (elapsedTime < SPIN_DURATION_MS) {
          animationFrameId = requestAnimationFrame(animate);
        } else {
          setVisibleChars(finalState);
          onSpinEnd();
        }
      };

      animationFrameId = requestAnimationFrame(animate);
      return () => cancelAnimationFrame(animationFrameId);
    }
  }, [isSpinning, targetCharacter, availableCharacters, onSpinEnd]);

  return (
    <div className={`grid grid-cols-3 gap-2 md:gap-4 p-2 md:p-3 rounded-lg border-2 bg-black/30 ${config.borderColor}`} 
         style={{
           boxShadow: theme === 'cyan' 
             ? '0 0 15px 5px rgba(34, 211, 238, 0.4), inset 0 0 10px 2px rgba(34, 211, 238, 0.3)'
             : '0 0 15px 5px rgba(251, 146, 60, 0.4), inset 0 0 10px 2px rgba(251, 146, 60, 0.3)'
         }}>
      <SlotReel character={visibleChars[0]} customIcons={customIcons} isCenter={false} />
      <div className={`rounded-md ${!isSpinning && targetCharacter ? 'bg-black/40 ring-1 ring-inset ring-white/10' : ''}`}>
        <SlotReel character={visibleChars[1]} customIcons={customIcons} isCenter={true} />
      </div>
      <SlotReel character={visibleChars[2]} customIcons={customIcons} isCenter={false} />
    </div>
  );
};

const PlayerSection: React.FC<{
  playerId: PlayerId;
  theme: 'cyan' | 'orange';
  availableCharacters: Character[];
  currentSelection: Character | null;
  customIcons: CustomIcons;
  isSpinning: boolean;
  targetCharacter: Character | null;
  onSpin: () => void;
  onSpinEnd: () => void;
  onSkip: (playerId: PlayerId) => void;
}> = ({
  playerId,
  theme,
  availableCharacters,
  currentSelection,
  onSpin,
  onSkip,
  customIcons,
  isSpinning,
  targetCharacter,
  onSpinEnd,
}) => {
  const config = PLAYER_CONFIG[playerId];
  const displayedCharacter = isSpinning ? targetCharacter : currentSelection;

  return (
    <section className={`p-4 md:p-6 rounded-lg border-2 bg-gray-800/50 ${config.borderColor}`}>
      <h2 className={`text-2xl font-bold tracking-widest uppercase mb-4 ${config.textColor}`}
          style={{
            textShadow: theme === 'cyan' 
              ? '0 0 8px rgba(34, 211, 238, 0.8)' 
              : '0 0 8px rgba(251, 146, 60, 0.8)'
          }}>
        {config.name}
      </h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <SlotMachine 
            isSpinning={isSpinning}
            targetCharacter={displayedCharacter}
            availableCharacters={availableCharacters}
            customIcons={customIcons}
            onSpinEnd={onSpinEnd}
            theme={theme}
          />
          <div className="mt-4 flex flex-wrap gap-2">
            <Button 
              onClick={onSpin} 
              disabled={isSpinning || availableCharacters.length === 0}
              className={config.buttonClasses}
            >
              {isSpinning ? 'Spinning...' : (availableCharacters.length === 0 ? 'Roster Exhausted' : 'Spin')}
            </Button>
            <Button 
              onClick={() => onSkip(playerId)}
              disabled={isSpinning || !currentSelection}
              className={config.buttonClasses}
            >
             Skip
            </Button>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <h3 className="text-sm uppercase tracking-wider text-gray-400 mb-1">Asset Status</h3>
            <div className={`p-3 rounded-md bg-black/30 min-h-[50px] flex items-center border ${config.borderColor}/50`}>
              <p className={`font-semibold text-lg ${config.textColor}`}>
                {currentSelection?.name || 'Awaiting Assignment'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// Main App Component
export default function Home() {
  const [customIcons, setCustomIcons] = useLocalStorage<CustomIcons>('mr_custom_icons', {});
  const [historyN, setHistoryN] = useLocalStorage<HistoryEntry[]>('mr_history_N', []);
  const [historyS, setHistoryS] = useLocalStorage<HistoryEntry[]>('mr_history_S', []);

  const [playerNSelection, setPlayerNSelection] = useState<Character | null>(null);
  const [playerSSelection, setPlayerSSelection] = useState<Character | null>(null);
  
  const [isSpinningN, setIsSpinningN] = useState(false);
  const [isSpinningS, setIsSpinningS] = useState(false);
  
  const [targetCharacterN, setTargetCharacterN] = useState<Character | null>(null);
  const [targetCharacterS, setTargetCharacterS] = useState<Character | null>(null);

  const [isAssetModalOpen, setIsAssetModalOpen] = useState(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);

  const availableCharacters = useMemo(() => {
    const combinedHistoryNames = new Set([...historyN, ...historyS].map(h => h.characterName));
    return CHARACTER_ROSTER.filter(char => !combinedHistoryNames.has(char.name));
  }, [historyN, historyS]);

  const handleSpinEnd = useCallback((playerId: PlayerId) => {
    const targetCharacter = playerId === 'N' ? targetCharacterN : targetCharacterS;
    if (!targetCharacter) return;

    const setHistory = playerId === 'N' ? setHistoryN : setHistoryS;
    const setSelection = playerId === 'N' ? setPlayerNSelection : setPlayerSSelection;
    const setIsSpinning = playerId === 'N' ? setIsSpinningN : setIsSpinningS;

    const newEntry: HistoryEntry = { characterName: targetCharacter.name, timestamp: Date.now() };
    
    setSelection(targetCharacter);
    setHistory(prev => [newEntry, ...prev]);
    setIsSpinning(false);
  }, [targetCharacterN, targetCharacterS, setHistoryN, setHistoryS]);

  const handleSpin = useCallback((playerId: PlayerId) => {
    const isSpinning = playerId === 'N' ? isSpinningN : isSpinningS;
    const otherPlayerSelection = playerId === 'N' ? playerSSelection : playerNSelection;
    if (isSpinning) return;

    const possibleChars = availableCharacters.filter(c => c.name !== otherPlayerSelection?.name);
    if (possibleChars.length === 0) return;

    const randomIndex = Math.floor(Math.random() * possibleChars.length);
    const selected = possibleChars[randomIndex];
    
    if (playerId === 'N') {
        setTargetCharacterN(selected);
        setIsSpinningN(true);
    } else {
        setTargetCharacterS(selected);
        setIsSpinningS(true);
    }
  }, [isSpinningN, isSpinningS, availableCharacters, playerNSelection, playerSSelection]);

  const handleSpinBoth = useCallback(() => {
    if (isSpinningN || isSpinningS || availableCharacters.length < 2) return;

    const shuffled = [...availableCharacters].sort(() => 0.5 - Math.random());
    const [charN, charS] = shuffled;
    
    setTargetCharacterN(charN);
    setIsSpinningN(true);
    setTargetCharacterS(charS);
    setIsSpinningS(true);
  }, [isSpinningN, isSpinningS, availableCharacters]);
  
  const handleSkip = useCallback((playerId: PlayerId) => {
    const setSelection = playerId === 'N' ? setPlayerNSelection : setPlayerSSelection;
    const setTarget = playerId === 'N' ? setTargetCharacterN : setTargetCharacterS;
    const setIsSpinning = playerId === 'N' ? setIsSpinningN : setIsSpinningS;

    setSelection(null);
    setTarget(null);
    setIsSpinning(false);
  }, []);

  const handleIconUpload = async (characterName: string, file: File) => {
    try {
      const dataUrl = await processImage(file);
      setCustomIcons(prev => ({ ...prev, [characterName]: dataUrl }));
    } catch (error) {
      console.error('Error processing image:', error);
      alert('Could not process image.');
    }
  };

  const handleIconRemove = (characterName: string) => {
    setCustomIcons(prev => {
      const newIcons = { ...prev };
      delete newIcons[characterName];
      return newIcons;
    });
  };

  const purgeAllHistory = useCallback(() => {
    setHistoryN([]);
    setHistoryS([]);
    setPlayerNSelection(null);
    setPlayerSSelection(null);
    setTargetCharacterN(null);
    setTargetCharacterS(null);
    setIsSpinningN(false);
    setIsSpinningS(false);
  }, [setHistoryN, setHistoryS]);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 font-mono"
         style={{
           backgroundImage: `
             linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px),
             linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)
           `,
           backgroundSize: '2rem 2rem'
         }}>
      <div className="container mx-auto p-4 md:p-6 lg:p-8">
        <header className="text-center mb-8 md:mb-12">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-widest text-white uppercase">
            <span className="text-cyan-400" style={{textShadow: '0 0 8px rgba(34, 211, 238, 0.8)'}}>Marvel Rivals</span>
            <span className="text-white mx-2">//</span>
            <span className="text-orange-400" style={{textShadow: '0 0 8px rgba(251, 146, 60, 0.8)'}}>Randomizer</span>
          </h1>
        </header>

        <main className="space-y-12">
          <PlayerSection
            playerId="N"
            theme="cyan"
            isSpinning={isSpinningN}
            targetCharacter={targetCharacterN}
            currentSelection={playerNSelection}
            onSpin={() => handleSpin('N')}
            onSpinEnd={() => handleSpinEnd('N')}
            onSkip={handleSkip}
            availableCharacters={availableCharacters.filter(c => c.name !== playerSSelection?.name)}
            customIcons={customIcons}
          />
          <PlayerSection
            playerId="S"
            theme="orange"
            isSpinning={isSpinningS}
            targetCharacter={targetCharacterS}
            currentSelection={playerSSelection}
            onSpin={() => handleSpin('S')}
            onSpinEnd={() => handleSpinEnd('S')}
            onSkip={handleSkip}
            availableCharacters={availableCharacters.filter(c => c.name !== playerNSelection?.name)}
            customIcons={customIcons}
          />
        </main>

        <footer className="mt-8 md:mt-12 pt-6 border-t-2 border-gray-700">
          <h3 className="text-center text-lg uppercase tracking-widest text-gray-400 mb-4">Master Command Center</h3>
          <div className="flex flex-wrap justify-center gap-3 md:gap-4">
            <Button onClick={handleSpinBoth} variant="primary" className="bg-green-600/30 border-green-500 hover:bg-green-500/50 hover:text-green-300 text-green-300">
              Spin Both
            </Button>
            <Button onClick={() => setIsAssetModalOpen(true)} variant="secondary">
              Asset Management
            </Button>
            <Button onClick={() => setIsHistoryModalOpen(true)} variant="secondary">
              History
            </Button>
          </div>
        </footer>
      </div>

      {/* Asset Management Modal */}
      <Modal isOpen={isAssetModalOpen} onClose={() => setIsAssetModalOpen(false)} title="Asset Management">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {CHARACTER_ROSTER.map((character) => (
            <div key={character.name} className="bg-gray-700/50 p-4 rounded-lg border border-gray-600">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-gray-600 rounded-md flex items-center justify-center text-sm font-bold overflow-hidden">
                  {customIcons[character.name] ? (
                    <img src={customIcons[character.name]} alt={character.name} className="w-full h-full object-cover rounded-md" />
                  ) : (
                    character.name.split(' ').map(n => n[0]).join('').substring(0, 2)
                  )}
                </div>
                <span className="text-sm font-medium text-gray-300">{character.name}</span>
              </div>
              <div className="flex gap-2">
                <label className="flex-1">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleIconUpload(character.name, file);
                    }}
                    className="hidden"
                  />
                  <span className="block w-full px-2 py-1 text-xs bg-blue-600/30 border border-blue-500 rounded hover:bg-blue-500/50 text-center cursor-pointer">
                    Upload
                  </span>
                </label>
                {customIcons[character.name] && (
                  <button
                    onClick={() => handleIconRemove(character.name)}
                    className="px-2 py-1 text-xs bg-red-600/30 border border-red-500 rounded hover:bg-red-500/50"
                  >
                    Remove
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </Modal>

      {/* History Modal */}
      <Modal isOpen={isHistoryModalOpen} onClose={() => setIsHistoryModalOpen(false)} title="Selection History">
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-bold text-gray-300">Combined History</h3>
            <Button onClick={purgeAllHistory} variant="secondary" className="bg-red-600/30 border-red-500 hover:bg-red-500/50">
              Purge All
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-cyan-400 font-bold mb-3">Niko's Selections</h4>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {historyN.length === 0 ? (
                  <p className="text-gray-500 text-sm">No selections yet</p>
                ) : (
                  historyN.map((entry, index) => (
                    <div key={index} className="bg-gray-700/50 p-2 rounded text-sm">
                      <div className="font-medium">{entry.characterName}</div>
                      <div className="text-gray-400 text-xs">
                        {new Date(entry.timestamp).toLocaleString()}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
            
            <div>
              <h4 className="text-orange-400 font-bold mb-3">Safwan's Selections</h4>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {historyS.length === 0 ? (
                  <p className="text-gray-500 text-sm">No selections yet</p>
                ) : (
                  historyS.map((entry, index) => (
                    <div key={index} className="bg-gray-700/50 p-2 rounded text-sm">
                      <div className="font-medium">{entry.characterName}</div>
                      <div className="text-gray-400 text-xs">
                        {new Date(entry.timestamp).toLocaleString()}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}