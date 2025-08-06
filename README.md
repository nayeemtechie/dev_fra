# Find Response Analyzer

A modern React application that analyzes and visualizes Algonomy Find API responses, providing detailed insights into search result scoring, facet analysis, and debug information.

## Features

- 🔍 **Real-time API Analysis**: Analyze any Find Request API URL and parse its response
- 📊 **Advanced Score Breakdown**: Detailed analysis of how each product's relevance score is calculated
- ⚙️ **Parameter Editor**: Visual interface to edit URL parameters individually
- 📱 **Responsive Design**: Works seamlessly on mobile and desktop devices  
- 🔧 **Debug Information**: Visualize hybrid search flow, vector algorithms, and threshold settings
- 📄 **Facet Analysis**: View available filters and their distribution across results
- ⚡ **Built with Vite**: Fast development and optimized production builds
- 🎨 **Styled with Tailwind CSS**: Modern, responsive design system
- 📦 **Component-based Architecture**: Modular and maintainable codebase

## Key Capabilities

### Score Analysis
- **Field Match Scores**: See individual field weights and lexical scoring ("max plus others" logic)
- **Product Attributes**: Exact matches and standard field contributions
- **Function Queries**: Global rank and product-specific functions
- **Range Queries**: Discount amounts, cut sizes, and other range-based scoring
- **Brand & Category Boosts**: Applied boosts with visual indicators
- **Multi-pass Scoring**: First pass, second pass, and threshold score breakdown

### Debug Information  
- **Hybrid Search Flow**: Vector search algorithms and execution details
- **Search Request Analysis**: Parsed URL parameters with detailed breakdown
- **Solr Debug Data**: Raw scoring explanations and query analysis

### Enhanced URL Handling
- **Automatic Parameter Processing**: Ensures required debug and field parameters
- **findDebug Override**: Automatically sets `findDebug=searchServiceDebug,solrDebugAll`
- **Parameter Editor**: Visual modal for editing individual URL parameters
- **URL Validation**: Handles various URL formats and provides helpful error messages

## Prerequisites

Make sure you have the following installed:

- **Node.js** (v16 or higher)
- **npm** or **yarn**
- **Git** (optional, for cloning)

## Installation Steps

### 1. Clone or Download the Project
```bash
# Option 1: Clone with Git
git clone <repository-url>
cd find-response-analyzer

# Option 2: Create directory and copy files
mkdir find-response-analyzer
cd find-response-analyzer
```

### 2. Initialize the Project (if starting from files)
```bash
npm init -y
```

### 3. Create the Project Structure
```bash
mkdir -p src/components src/hooks src/services src/data src/images
```

### 4. Copy Project Files
Copy all the provided files to their respective directories:
- `package.json` → root directory
- `index.html` → root directory  
- `tailwind.config.js` → root directory
- `vite.config.js` → root directory
- `postcss.config.js` → root directory
- All `src/` files to their respective subdirectories

### 5. Install Dependencies
```bash
npm install
```

## Running the Application

### Development Mode
```bash
npm run dev
```
Then open your browser and navigate to `http://localhost:5173`

### Production Build
```bash
npm run build
```
Built files will be in the `dist` directory.

### Preview Production Build
```bash
npm run preview
```

## Project Structure

```
find-response-analyzer/
├── src/
│   ├── components/
│   │   ├── SearchHeader.jsx         # Application header with logo
│   │   ├── ApiUrlInput.jsx          # URL input with parameter editor
│   │   ├── ParameterEditor.jsx      # Modal for editing URL parameters
│   │   ├── WelcomeScreen.jsx        # Initial landing page
│   │   ├── FilterSidebar.jsx        # Facets display sidebar
│   │   ├── ProductGrid.jsx          # Search results grid
│   │   ├── ProductScoreDetail.jsx   # Score analysis modal
│   │   ├── SearchDebugInfo.jsx      # Debug information panel
│   │   └── Pagination.jsx           # Results pagination
│   ├── hooks/
│   │   └── useSearch.js             # Search state management hook
│   ├── services/
│   │   └── searchApi.js             # API service and data transformation
│   ├── data/
│   │   └── mockData.js              # Fallback mock data
│   ├── images/
│   │   └── algonomy-min.png         # Logo asset
│   ├── App.jsx                      # Main application component
│   ├── main.jsx                     # Application entry point
│   └── index.css                    # Global styles
├── index.html                       # HTML template
├── package.json                     # Dependencies and scripts
├── tailwind.config.js              # Tailwind CSS configuration
├── vite.config.js                  # Vite configuration
├── postcss.config.js               # PostCSS configuration
└── README.md                       # This file
```

## How to Use

### Basic Usage
1. **Enter API URL**: Paste your Find Request API URL in the text area
2. **Use Parameter Editor**: Click the gear icon to edit individual parameters in a visual interface
3. **Analyze Results**: Click "Analyze" to fetch and process the API response
4. **Explore Results**: Browse products, facets, and debug information
5. **View Score Details**: Click "View Score Analysis" on any product for detailed scoring breakdown

### Parameter Editor Features
- **Visual Editing**: Edit each URL parameter in separate fields
- **Status Indicators**: See which parameters are added, modified, or unchanged
- **Add/Remove**: Easily add new parameters or remove existing ones
- **Live Preview**: See the constructed URL as you make changes
- **Reset Changes**: Undo all modifications back to original values

### Automatic Parameter Processing
The application automatically:
- **Overrides `findDebug`**: Sets to `searchServiceDebug,solrDebugAll` for detailed scoring
- **Ensures Required Fields**: Adds `fl=name,imageId` for proper display
- **Handles URL Formats**: Works with various URL formats and encodings

## Customization

### Connecting to Different APIs
Modify `src/services/searchApi.js` to connect to your specific API endpoints:

```javascript
// Update the API endpoint in searchProducts function
const apiUrl = `https://your-api-endpoint.com/search?query=${encodeURIComponent(query)}...`;
```

### Customizing Debug Parameters
In `src/components/ApiUrlInput.jsx`, modify the debug parameters:

```javascript
// Change the findDebug value
url.searchParams.set('findDebug', 'your,custom,debug,params');
```

### Styling Customization
- **Tailwind Configuration**: Modify `tailwind.config.js` for design system changes
- **Custom Styles**: Add styles in `src/index.css`
- **Component Styling**: Update individual component classes

### Adding New Features
The modular architecture makes it easy to add new features:
- **New Analysis Types**: Add components in `src/components/`
- **Additional API Endpoints**: Extend `src/services/searchApi.js`
- **New Data Transformations**: Add utilities for processing different response formats

## API Response Format

The application expects Find API responses in this format:

```json
{
  "placements": [{
    "docs": [
      {
        "id": "product-id",
        "name": "Product Name", 
        "imageId": "image-url",
        "score": 42.5
      }
    ],
    "numFound": 150,
    "facets": [...],
    "debug": {
      "searchServiceDebug": {...},
      "solrDebug": {...}
    }
  }]
}
```

## Troubleshooting

### Common Issues

**Port Already in Use**
- Vite will automatically try the next available port
- Check the terminal output for the actual port being used

**API Connection Issues**  
- Check CORS settings on your API endpoint
- Verify the API URL format and parameters
- Check browser developer tools for network errors

**Build Failures**
```bash
# Clear npm cache and reinstall
npm cache clean --force
rm -rf node_modules
npm install
```

**Missing Dependencies**
```bash
# Install any missing peer dependencies
npm install --save-dev @types/react @types/react-dom
```

### Performance Optimization

For large result sets:
- Results are paginated automatically
- Complex scoring calculations are performed on-demand
- Consider implementing virtual scrolling for very large datasets

### Browser Compatibility
- Modern browsers (Chrome, Firefox, Safari, Edge)
- ES2020+ features used
- No Internet Explorer support

## Development

### Code Structure
- **Functional Components**: Using React Hooks throughout
- **Custom Hooks**: `useSearch` for state management
- **Service Layer**: API calls abstracted in `searchApi.js`
- **Mock Data**: Fallback data for development and testing

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint (if configured)

## Contributing

This is a specialized tool for analyzing Algonomy Find API responses. When extending the application:

1. Follow the existing component structure
2. Add proper error handling and loading states
3. Include console logging for debugging
4. Test with various API response formats
5. Update this README for any new features

## License

MIT License - feel free to use and modify as needed.