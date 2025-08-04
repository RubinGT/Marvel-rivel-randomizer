# Marvel Rivals Randomizer

A Next.js 14 application for randomly selecting Marvel Rivals characters with permanent icon storage capabilities.

## Features

### 🎲 Character Randomization
- Supports two players: Niko (cyan theme) and Safwan (orange theme)
- Individual spin functionality for each player
- "Spin Both" feature for simultaneous character selection
- Animated slot machine interface with smooth transitions
- Characters are automatically removed from available pool after selection

### 🖼️ Permanent Icon Storage
- **Upload custom character icons** through the Asset Management modal
- **Icons are permanently saved** using localStorage and persist across browser sessions
- Support for any image format (PNG, JPG, GIF, etc.)
- Icons are converted to base64 data URLs for offline storage
- **Remove icons** functionality to revert to default character initials
- Automatic fallback to character initials when no icon is uploaded

### 📊 Selection History
- Complete history tracking for both players
- Timestamps for all character selections
- Separate history sections for each player
- "Purge All" functionality to reset all data
- Used characters are excluded from future randomization until reset

### 🎨 Modern UI Design
- Dark theme with cyberpunk-inspired aesthetic
- Player-specific color themes (cyan/orange)
- Responsive design for mobile and desktop
- Modal dialogs for asset management and history
- Smooth animations and visual feedback
- Grid background pattern for enhanced visual appeal

## Technical Implementation

### Architecture
- **Next.js 14** with App Router
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **Client-side component** with "use client" directive
- Local storage for persistent data management

### Key Components
- `useLocalStorage` - Custom hook for persistent state management
- `SlotMachine` - Animated character selection interface
- `PlayerSection` - Individual player controls and display
- `Modal` - Reusable modal dialog component
- `Button` - Styled button component with variants

### Data Storage
- **Character Icons**: Stored as base64 data URLs in localStorage with key `'mr_custom_icons'`
- **Player History**: Separate localStorage entries for each player (`'mr_history_N'`, `'mr_history_S'`)
- **Automatic Persistence**: All data is automatically saved on changes and restored on page load

### Character Roster
Complete Marvel Rivals character set including:
- Adam Warlock, Black Panther, Black Widow, Captain America
- Cloak & Dagger, Doctor Strange, Emma Frost, Groot
- Hawkeye, Hela, Hulk, Human Torch, Invisible Woman
- Iron Fist, Iron Man, Jeff the Land Shark, Loki
- Luna Snow, Magik, Magneto, Mantis, Mister Fantastic
- Moon Knight, Namor, Peni Parker, Phoenix, Psylocke
- The Punisher, The Thing, Rocket Raccoon, Scarlet Witch
- Squirrel Girl, Spider-Man, Star-Lord, Storm, Thor
- Ultron, Venom, Winter Soldier, Wolverine

## Usage

### Getting Started
1. Install dependencies: `npm install`
2. Run development server: `npm run dev`
3. Build for production: `npm run build`

### How to Use
1. **Upload Icons**: Click "Asset Management" → Select character → "Upload" → Choose image file
2. **Spin Characters**: Use individual "Spin" buttons or "Spin Both" for simultaneous selection
3. **Skip Selection**: Use "Skip" to clear current selection and return character to available pool
4. **View History**: Click "History" to see all past selections and timestamps
5. **Reset Data**: Use "Purge All" in history modal to clear all data and start fresh

### Permanent Icon Storage
- Icons are stored locally in your browser and persist across sessions
- Maximum storage depends on browser limits (typically 5-10MB)
- Icons are automatically compressed to base64 format
- To remove an icon, use the "Remove" button in Asset Management

## Development

Built with Next.js 14 App Router architecture:
- Server Components for initial rendering
- Client Components for interactivity
- TypeScript for type safety
- Tailwind CSS for responsive design
- Local storage for data persistence

The application is fully self-contained with no external API dependencies, making it fast and reliable for offline use.