# Bookmarks Chrome Extension

A React-based Chrome extension for managing and viewing your bookmarks in a modern, searchable interface.

## Features

- 📚 View all your Chrome bookmarks in a clean interface
- 🔍 Search bookmarks by title or URL
- 📁 Expandable folder structure
- 🎨 Modern UI with gradient design
- ⚡ Fast and responsive

## Development Setup

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Google Chrome browser

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start development mode with hot reload:
```bash
npm run dev
```

3. Build for production:
```bash
npm run build
```

### Loading the Extension in Chrome

1. Open Chrome and navigate to `chrome://extensions/`
2. Enable "Developer mode" in the top right corner
3. Click "Load unpacked" button
4. Select the `dist` folder from this project
5. The extension will appear in your extensions list

### Using the Extension

Click on the Bookmarks extension icon in your Chrome toolbar to open the bookmarks manager in a new tab.

## Project Structure

```
bookmarks/
├── src/
│   ├── components/        # React components
│   │   ├── BookmarkList.tsx
│   │   └── BookmarkItem.tsx
│   ├── App.tsx            # Main React app
│   ├── index.tsx          # React entry point
│   └── background.ts      # Chrome extension background script
├── public/
│   ├── manifest.json      # Chrome extension manifest
│   ├── index.html         # HTML template
│   └── icons/             # Extension icons
├── dist/                  # Built extension (generated)
├── webpack.config.js      # Webpack configuration
├── tsconfig.json          # TypeScript configuration
└── package.json           # Project dependencies
```

## Development Features

- **Hot Reload**: The webpack configuration includes watch mode for automatic rebuilds
- **TypeScript**: Full TypeScript support for type safety
- **React 18**: Using the latest React features
- **Chrome APIs**: Type-safe Chrome extension API access

## Scripts

- `npm run dev` - Start development mode with file watching
- `npm run build` - Build production version
- `npm run clean` - Clean the dist folder

## Customization

### Icons
Replace the placeholder icons in `public/icons/` with your own designs:
- icon16.png (16x16px)
- icon48.png (48x48px)  
- icon128.png (128x128px)

### Styling
Modify the CSS files in `src/` and `src/components/` to customize the appearance.

## Future Enhancements

- [ ] Add bookmark editing capabilities
- [ ] Implement bookmark organization features
- [ ] Add export/import functionality
- [ ] Include bookmark statistics
- [ ] Add dark mode toggle
- [ ] Implement bookmark tags and categories

## License

MIT