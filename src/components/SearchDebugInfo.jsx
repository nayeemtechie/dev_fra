import { useState } from 'react';
import { ChevronDown, ChevronUp, Info, Search, Zap, ArrowRight } from 'lucide-react';

export const SearchDebugInfo = ({ debugData }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState('hybrid');

  if (!debugData || !debugData.searchServiceDebug) {
    return null;
  }

  const { searchServiceDebug } = debugData;
  
  // Extract values from searchServiceDebug
  const hybridSearch = searchServiceDebug.hybridSearch || [];
  const searchRequest = searchServiceDebug.searchRequest || '';

  // Helper function to parse and format the search URL
  const formatSearchRequest = (url) => {
    if (!url) return [];
    
    try {
      // Extract the base URL and parameters
      const [baseUrl, paramsString] = url.split('?');
      if (!paramsString) return [{ key: 'URL', value: baseUrl }];
      
      // Parse parameters
      const params = paramsString.split('&').map(param => {
        const [key, value] = param.split('=');
        return { key: decodeURIComponent(key), value: decodeURIComponent(value || '') };
      });
      
      return [
        { key: 'Base URL', value: baseUrl },
        ...params
      ];
    } catch (e) {
      console.error('Error parsing search URL:', e);
      return [{ key: 'URL', value: url }];
    }
  };

  const parsedSearchRequest = formatSearchRequest(searchRequest);

  // Enhanced hybrid search analysis to handle both old and new API formats
  const analyzeHybridSearch = (hybridSearch) => {
    const analysis = {
      hybridSearchFlow: "Unknown",
      vectorAlgorithm: "Unknown",
      minReturnValue: "Unknown",
      topResults: null,
      similarityThreshold: null
    };

    if (!hybridSearch || hybridSearch.length === 0) {
      return analysis;
    }

    // Extract hybrid search flow - works for both formats
    const flowItem = hybridSearch.find(item => item.includes("Hybrid search is executed for"));
    if (flowItem) {
      const flowMatch = flowItem.split(" for ");
      if (flowMatch.length > 1) {
        analysis.hybridSearchFlow = flowMatch[1];
      }
    }

    // Handle OLD format: "Vector search based on the algo RR_VECTOR_SIMILARITY with minReturn as 0.72 for Main flow"
    const oldFormatItem = hybridSearch.find(item => 
      item.includes("Vector search based on the algo") && item.includes("with minReturn as")
    );
    
    if (oldFormatItem) {
      // Extract algorithm from old format
      const algoMatch = oldFormatItem.match(/algo\s+(\w+)/);
      if (algoMatch && algoMatch[1]) {
        analysis.vectorAlgorithm = algoMatch[1];
      }
      
      // Extract minReturn from old format
      const minReturnMatch = oldFormatItem.match(/minReturn as\s+([\d.]+)/);
      if (minReturnMatch && minReturnMatch[1]) {
        analysis.minReturnValue = minReturnMatch[1];
      }
    }

    // Handle NEW format: "Top 500 results with similarity above 0.72 will be picked from RR_KNN_SIMILARITY Vector search based on the configuration for Main flow"
    const newFormatItem = hybridSearch.find(item => 
      item.includes("results with similarity above") && item.includes("will be picked from")
    );
    
    if (newFormatItem) {
      // Extract top results count from new format
      const topResultsMatch = newFormatItem.match(/Top\s+(\d+)\s+results/);
      if (topResultsMatch && topResultsMatch[1]) {
        analysis.topResults = topResultsMatch[1];
      }
      
      // Extract similarity threshold from new format
      const similarityMatch = newFormatItem.match(/similarity above\s+([\d.]+)/);
      if (similarityMatch && similarityMatch[1]) {
        analysis.similarityThreshold = similarityMatch[1];
        // Use similarity threshold as minReturn for backward compatibility
        if (analysis.minReturnValue === "Unknown") {
          analysis.minReturnValue = similarityMatch[1];
        }
      }
      
      // Extract algorithm from new format
      const newAlgoMatch = newFormatItem.match(/from\s+(\w+)\s+Vector search/);
      if (newAlgoMatch && newAlgoMatch[1]) {
        analysis.vectorAlgorithm = newAlgoMatch[1];
      }
    }

    // Fallback: try to extract algorithm from any item containing vector algorithm names
    if (analysis.vectorAlgorithm === "Unknown") {
      const algorithmPatterns = [
        /RR_VECTOR_SIMILARITY/,
        /RR_KNN_SIMILARITY/,
        /VECTOR_SIMILARITY/,
        /KNN_SIMILARITY/
      ];
      
      for (const item of hybridSearch) {
        for (const pattern of algorithmPatterns) {
          if (pattern.test(item)) {
            const match = item.match(pattern);
            if (match) {
              analysis.vectorAlgorithm = match[0];
              break;
            }
          }
        }
        if (analysis.vectorAlgorithm !== "Unknown") break;
      }
    }

    // Additional fallback for minReturn/threshold extraction from any item
    if (analysis.minReturnValue === "Unknown") {
      for (const item of hybridSearch) {
        // Look for any decimal number that could be a threshold
        const thresholdMatches = item.match(/([\d.]+)/g);
        if (thresholdMatches) {
          // Filter for reasonable threshold values (0.0 to 1.0)
          const reasonableThresholds = thresholdMatches.filter(val => {
            const num = parseFloat(val);
            return num >= 0.0 && num <= 1.0 && val.includes('.');
          });
          
          if (reasonableThresholds.length > 0) {
            analysis.minReturnValue = reasonableThresholds[0];
            break;
          }
        }
      }
    }

    return analysis;
  };

  // Get the enhanced analysis
  const hybridAnalysis = analyzeHybridSearch(hybridSearch);

  return (
    <div className="bg-white border rounded-lg shadow-sm mb-6 overflow-hidden">
      <div 
        className="flex justify-between items-center p-4 cursor-pointer bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center">
          <Info className="h-5 w-5 text-blue-600 mr-2" />
          <h3 className="text-lg font-medium text-gray-800">Search Debug Information</h3>
        </div>
        {isExpanded ? <ChevronUp className="h-5 w-5 text-blue-500" /> : <ChevronDown className="h-5 w-5 text-blue-500" />}
      </div>
      
      {isExpanded && (
        <>
          <div className="border-b">
            <nav className="flex px-4" aria-label="Tabs">
              <button
                onClick={() => setActiveTab('hybrid')}
                className={`px-3 py-2 text-sm font-medium border-b-2 ${
                  activeTab === 'hybrid' 
                    ? 'border-indigo-500 text-indigo-600' 
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center">
                  <Zap className="h-4 w-4 mr-1" />
                  Hybrid Search
                </div>
              </button>

              <button
                onClick={() => setActiveTab('request')}
                className={`ml-8 px-3 py-2 text-sm font-medium border-b-2 ${
                  activeTab === 'request' 
                    ? 'border-indigo-500 text-indigo-600' 
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center">
                  <Search className="h-4 w-4 mr-1" />
                  Search Request
                </div>
              </button>
            </nav>
          </div>
          
          <div className="p-4">
            {activeTab === 'hybrid' && (
              <div>
                <div className="bg-indigo-50 p-3 rounded-md mb-4">
                  <h4 className="text-sm font-medium text-indigo-800 mb-2">Hybrid Search Analysis</h4>
                  
                  {/* Enhanced grid to handle new format data */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                    <div className="bg-white p-3 rounded border border-indigo-100">
                      <p className="text-xs text-gray-500">Search Flow</p>
                      <p className="font-medium text-indigo-900">{hybridAnalysis.hybridSearchFlow}</p>
                    </div>
                    <div className="bg-white p-3 rounded border border-indigo-100">
                      <p className="text-xs text-gray-500">Vector Algorithm</p>
                      <p className="font-medium text-indigo-900">{hybridAnalysis.vectorAlgorithm}</p>
                    </div>
                    <div className="bg-white p-3 rounded border border-indigo-100">
                      <p className="text-xs text-gray-500">Similarity Threshold</p>
                      <p className="font-medium text-indigo-900">{hybridAnalysis.minReturnValue}</p>
                    </div>
                    {/* New field for top results count when available */}
                    {hybridAnalysis.topResults && (
                      <div className="bg-white p-3 rounded border border-indigo-100">
                        <p className="text-xs text-gray-500">Top Results</p>
                        <p className="font-medium text-indigo-900">{hybridAnalysis.topResults}</p>
                      </div>
                    )}
                  </div>

                  {/* Additional info section for new format details */}
                  {(hybridAnalysis.topResults || hybridAnalysis.similarityThreshold) && (
                    <div className="mt-3 p-2 bg-blue-50 rounded border border-blue-200">
                      <p className="text-xs text-blue-700">
                        <strong>Vector Search Configuration:</strong>
                        {hybridAnalysis.topResults && ` Top ${hybridAnalysis.topResults} results`}
                        {hybridAnalysis.similarityThreshold && ` with similarity above ${hybridAnalysis.similarityThreshold}`}
                        {hybridAnalysis.vectorAlgorithm !== "Unknown" && ` using ${hybridAnalysis.vectorAlgorithm}`}
                      </p>
                    </div>
                  )}
                </div>
                
                <h4 className="font-medium text-gray-700 mb-2 text-sm">Raw Debug Output:</h4>
                <ul className="bg-gray-50 p-3 rounded-md text-sm text-gray-600 space-y-1 max-h-60 overflow-auto">
                  {hybridSearch.map((item, index) => (
                    <li key={index} className="flex">
                      <ArrowRight className="h-4 w-4 text-gray-400 flex-shrink-0 mt-0.5 mr-1" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>

                {/* Debug information for developers */}
                {process.env.NODE_ENV === 'development' && (
                  <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded">
                    <p className="text-xs text-yellow-800 font-medium mb-2">Debug Info (Development Only):</p>
                    <pre className="text-xs text-yellow-700 overflow-auto">
{JSON.stringify(hybridAnalysis, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            )}

            
            {activeTab === 'request' && (
              <div>
                <h4 className="font-medium text-gray-700 mb-2 text-sm">Search Request Parameters:</h4>
                <div className="bg-gray-50 rounded-md text-sm text-gray-600 max-h-80 overflow-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/4">Parameter</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-3/4">Value</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {parsedSearchRequest.map((param, index) => (
                        <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                          <td className="px-3 py-2 whitespace-nowrap text-xs font-medium text-gray-800">{param.key}</td>
                          <td className="px-3 py-2 text-xs text-gray-500 break-all">{param.value}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};