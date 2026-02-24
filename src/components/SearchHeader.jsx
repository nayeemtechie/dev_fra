import algonomyLogo from '../images/algonomy-min.png';

export const SearchHeader = () => {
  return (
    <div className="bg-gradient-to-r from-indigo-50 via-white to-purple-50 border-b border-indigo-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <a
          href="/"
          onClick={(e) => { e.preventDefault(); window.location.reload(); }}
          className="flex items-center py-4 cursor-pointer hover:opacity-80 transition-opacity duration-200"
        >
          <div className="bg-white rounded-lg p-1.5 ring-1 ring-indigo-100 mr-3">
            <img
              src={algonomyLogo}
              alt="Algonomy"
              style={{ height: '28px', width: 'auto' }}
            />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-800 tracking-tight">
              Find Response Analyzer
            </h1>
            <p className="text-indigo-400 text-xs mt-0.5">
              Analyze &amp; debug Algonomy Find API responses
            </p>
          </div>
        </a>
      </div>
    </div>
  );
};