import { useState } from 'react';
import { Search, Settings, SlidersHorizontal } from 'lucide-react';
import { ParameterEditor } from './ParameterEditor';

const spinKeyframes = `
@keyframes gentle-spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(90deg); }
}
`;

export const ApiUrlInput = ({ onSearch }) => {
  const [apiUrl, setApiUrl] = useState('');
  const [showParameterEditor, setShowParameterEditor] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (apiUrl.trim()) {
      processAndSearch(apiUrl.trim());
    }
  };

  const processAndSearch = (urlToProcess) => {
    // Create a URL object to easily manipulate parameters
    let urlToUse = urlToProcess;

    // Ensure the URL has a '?' character to separate the base URL from parameters
    if (!urlToUse.includes('?')) {
      urlToUse += '?';
    }

    // Append parameters to the URL, checking if they already exist
    const url = new URL(urlToUse.startsWith('http') ? urlToUse : `http://placeholder.com/${urlToUse}`);

    // Override findDebug parameter if it exists, or add it if it doesn't
    url.searchParams.set('findDebug', 'searchServiceDebug,solrDebugAll');

    // Add or update fl parameter
    if (!url.searchParams.has('fl')) {
      url.searchParams.set('fl', 'name,imageId');
    } else {
      // If fl already exists, make sure it includes name and imageId
      const currentFl = url.searchParams.get('fl');
      const flParams = currentFl.split(',');

      if (!flParams.includes('name')) {
        flParams.push('name');
      }

      if (!flParams.includes('imageId')) {
        flParams.push('imageId');
      }

      url.searchParams.set('fl', flParams.join(','));
    }

    // Get the final URL string, removing the placeholder if we added it
    let finalUrl = url.toString();
    if (finalUrl.startsWith('http://placeholder.com/')) {
      finalUrl = finalUrl.substring('http://placeholder.com/'.length);
    }

    console.log('Using URL with processed parameters:', finalUrl);
    onSearch(finalUrl);
  };

  const handleParameterEditorSave = (editedUrl) => {
    setApiUrl(editedUrl);
    setShowParameterEditor(false);
    processAndSearch(editedUrl);
  };

  const openParameterEditor = () => {
    if (apiUrl.trim()) {
      setShowParameterEditor(true);
    } else {
      alert('Please enter a URL first to edit its parameters.');
    }
  };

  return (
    <>
      <style>{spinKeyframes}</style>
      <div className="mb-6 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Title bar */}
        <div className="px-5 py-3 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-100">
          <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">API URL</h2>
        </div>

        <div className="p-5">
          <p className="text-sm text-gray-500 mb-3">
            Enter the Find Request API URL to analyze its response:
          </p>
          <form onSubmit={handleSubmit} className="flex flex-col space-y-3">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-grow">
                <textarea
                  value={apiUrl}
                  onChange={(e) => setApiUrl(e.target.value)}
                  className="block w-full px-4 py-3 border border-gray-200 rounded-xl shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm h-24 bg-gray-50 focus:bg-white transition-colors duration-200 resize-none"
                  placeholder="https://recs.richrelevance.com/rrserver/api/find/v1/5db612dbf0548888?query=sheba&rows=30"
                />
              </div>
              <div className="flex sm:flex-col gap-2 justify-end sm:justify-center">
                <button
                  type="button"
                  onClick={openParameterEditor}
                  className="group inline-flex items-center gap-1.5 px-3 py-2.5 border border-indigo-200 rounded-xl shadow-sm text-sm font-medium text-indigo-700 bg-indigo-50 hover:bg-indigo-100 hover:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200"
                  title="Edit Request Parameters"
                >
                  <SlidersHorizontal
                    className="h-4 w-4 transition-transform duration-300 group-hover:rotate-12"
                  />
                  <span className="whitespace-nowrap text-xs">Edit Params</span>
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center px-5 py-2.5 border border-transparent rounded-xl shadow-sm text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200"
                >
                  <Search className="h-4 w-4 mr-2" />
                  Analyze
                </button>
              </div>
            </div>
            <div className="text-xs text-gray-400 bg-gray-50 rounded-lg px-3 py-2 border border-gray-100">
              <p className="font-medium text-gray-500 mb-1">Auto-processed parameters:</p>
              <ul className="list-disc pl-4 space-y-0.5">
                <li><code className="text-indigo-500 bg-indigo-50 px-1 rounded">findDebug=searchServiceDebug,solrDebugAll</code> — scoring info (overrides existing)</li>
                <li><code className="text-indigo-500 bg-indigo-50 px-1 rounded">fl=name,imageId</code> — required display fields (appended)</li>
              </ul>
            </div>
          </form>
        </div>
      </div>

      {showParameterEditor && (
        <ParameterEditor
          url={apiUrl}
          onSave={handleParameterEditorSave}
          onClose={() => setShowParameterEditor(false)}
        />
      )}
    </>
  );
};