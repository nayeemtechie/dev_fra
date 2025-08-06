import { useState, useEffect } from 'react';
import { X, Plus, Trash2, Save, RotateCcw } from 'lucide-react';

export const ParameterEditor = ({ url, onSave, onClose }) => {
  const [baseUrl, setBaseUrl] = useState('');
  const [parameters, setParameters] = useState([]);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    parseUrl(url);
  }, [url]);

  const parseUrl = (urlString) => {
    if (!urlString) return;

    try {
      // Handle URLs that might not have http prefix
      let fullUrl = urlString;
      if (!fullUrl.startsWith('http')) {
        fullUrl = `https://${fullUrl}`;
      }

      const urlObj = new URL(fullUrl);
      const base = `${urlObj.protocol}//${urlObj.host}${urlObj.pathname}`;
      setBaseUrl(base);

      // Convert search params to array
      const params = [];
      urlObj.searchParams.forEach((value, key) => {
        params.push({ 
          id: Math.random().toString(36).substr(2, 9), 
          key, 
          value,
          originalKey: key,
          originalValue: value
        });
      });
      
      setParameters(params);
      setHasChanges(false);
    } catch (error) {
      console.error('Error parsing URL:', error);
      // Fallback: try to parse manually
      const [base, queryString] = urlString.split('?');
      setBaseUrl(base);
      
      if (queryString) {
        const params = queryString.split('&').map(param => {
          const [key, value] = param.split('=');
          const decodedKey = decodeURIComponent(key || '');
          const decodedValue = decodeURIComponent(value || '');
          return { 
            id: Math.random().toString(36).substr(2, 9), 
            key: decodedKey, 
            value: decodedValue,
            originalKey: decodedKey,
            originalValue: decodedValue
          };
        });
        setParameters(params);
      }
    }
  };

  const updateParameter = (id, field, value) => {
    setParameters(prev => prev.map(param => 
      param.id === id ? { ...param, [field]: value } : param
    ));
    setHasChanges(true);
  };

  const addParameter = () => {
    const newParam = { 
      id: Math.random().toString(36).substr(2, 9), 
      key: '', 
      value: '',
      originalKey: '',
      originalValue: ''
    };
    setParameters(prev => [...prev, newParam]);
    setHasChanges(true);
  };

  const removeParameter = (id) => {
    setParameters(prev => prev.filter(param => param.id !== id));
    setHasChanges(true);
  };

  const resetChanges = () => {
    parseUrl(url);
  };

  const handleSave = () => {
    // Construct the URL from base + parameters
    const urlObj = new URL(baseUrl);
    
    parameters.forEach(param => {
      if (param.key.trim()) {
        urlObj.searchParams.set(param.key.trim(), param.value);
      }
    });

    let finalUrl = urlObj.toString();
    
    // If original URL didn't have http, remove it
    if (!url.startsWith('http')) {
      finalUrl = finalUrl.replace(/^https?:\/\//, '');
    }

    onSave(finalUrl);
  };

  const getParameterStatus = (param) => {
    if (!param.originalKey && param.key) return 'added';
    if (param.originalKey && !param.key) return 'removed';
    if (param.key !== param.originalKey || param.value !== param.originalValue) return 'modified';
    return 'unchanged';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'added': return 'border-green-300 bg-green-50';
      case 'modified': return 'border-yellow-300 bg-yellow-50';
      case 'removed': return 'border-red-300 bg-red-50';
      default: return 'border-gray-300 bg-white';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'added': return <Plus className="w-4 h-4 text-green-600" />;
      case 'modified': return <RotateCcw className="w-4 h-4 text-yellow-600" />;
      case 'removed': return <Trash2 className="w-4 h-4 text-red-600" />;
      default: return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-indigo-600 text-white p-4 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">Edit URL Parameters</h2>
            <p className="text-indigo-100 text-sm">Modify individual parameters for the API request</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-indigo-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          {/* Base URL */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Base URL
            </label>
            <input
              type="text"
              value={baseUrl}
              onChange={(e) => {
                setBaseUrl(e.target.value);
                setHasChanges(true);
              }}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="https://example.com/api/path"
            />
          </div>

          {/* Parameters */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Parameters ({parameters.length})
              </label>
              <button
                onClick={addParameter}
                className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-indigo-600 bg-indigo-100 hover:bg-indigo-200"
              >
                <Plus className="w-4 h-4 mr-1" />
                Add Parameter
              </button>
            </div>

            <div className="space-y-3">
              {parameters.map((param) => {
                const status = getParameterStatus(param);
                return (
                  <div
                    key={param.id}
                    className={`border rounded-lg p-4 ${getStatusColor(status)}`}
                  >
                    <div className="flex items-center gap-3">
                      {/* Status indicator */}
                      <div className="flex-shrink-0 w-6 flex justify-center">
                        {getStatusIcon(status)}
                      </div>

                      {/* Parameter key */}
                      <div className="flex-1 min-w-0">
                        <input
                          type="text"
                          value={param.key}
                          onChange={(e) => updateParameter(param.id, 'key', e.target.value)}
                          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          placeholder="Parameter name"
                        />
                      </div>

                      {/* Equals sign */}
                      <div className="flex-shrink-0 text-gray-400 font-mono">=</div>

                      {/* Parameter value */}
                      <div className="flex-1 min-w-0">
                        <input
                          type="text"
                          value={param.value}
                          onChange={(e) => updateParameter(param.id, 'value', e.target.value)}
                          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          placeholder="Parameter value"
                        />
                      </div>

                      {/* Remove button */}
                      <button
                        onClick={() => removeParameter(param.id)}
                        className="flex-shrink-0 p-2 text-red-600 hover:bg-red-100 rounded-md transition-colors"
                        title="Remove parameter"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Show original values for modified parameters */}
                    {status === 'modified' && (
                      <div className="mt-2 text-xs text-gray-500 pl-9">
                        Original: <code>{param.originalKey}={param.originalValue}</code>
                      </div>
                    )}
                  </div>
                );
              })}

              {parameters.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <div className="text-sm">No parameters found.</div>
                  <button
                    onClick={addParameter}
                    className="mt-2 text-indigo-600 hover:text-indigo-800 text-sm"
                  >
                    Add your first parameter
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Preview */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Preview URL
            </label>
            <div className="bg-gray-50 p-3 rounded-md border">
              <code className="text-sm text-gray-800 break-all">
                {baseUrl}
                {parameters.filter(p => p.key.trim()).length > 0 && '?'}
                {parameters
                  .filter(p => p.key.trim())
                  .map(p => `${encodeURIComponent(p.key)}=${encodeURIComponent(p.value)}`)
                  .join('&')
                }
              </code>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-3 flex justify-between">
          <div className="flex gap-2">
            <button
              onClick={resetChanges}
              disabled={!hasChanges}
              className={`px-4 py-2 text-sm font-medium rounded-md border ${
                hasChanges
                  ? 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50'
                  : 'border-gray-200 text-gray-400 bg-gray-100 cursor-not-allowed'
              }`}
            >
              Reset Changes
            </button>
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700"
            >
              <Save className="w-4 h-4 mr-2" />
              Save & Analyze
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};