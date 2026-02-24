import { Search, BarChart2, Filter, Code, ArrowRight, Sparkles } from 'lucide-react';

export const WelcomeScreen = () => {
  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-indigo-50 via-white to-purple-50 rounded-2xl shadow-sm border border-indigo-100 p-8 lg:p-10">
        {/* Decorative background circles */}
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-indigo-100 rounded-full opacity-40 blur-2xl"></div>
        <div className="absolute -bottom-8 -left-8 w-36 h-36 bg-purple-100 rounded-full opacity-40 blur-2xl"></div>

        <div className="relative">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="h-5 w-5 text-indigo-500" />
            <span className="text-sm font-semibold text-indigo-600 uppercase tracking-wide">
              Welcome
            </span>
          </div>
          <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-3">
            Analyze Find API Responses
          </h2>
          <p className="text-gray-600 max-w-2xl text-base leading-relaxed">
            Understand how the Algonomy Find API generates search results, scores products,
            and applies ranking algorithms — all in a visual, interactive interface.
          </p>
        </div>
      </div>

      {/* How to Use Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 lg:p-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <ArrowRight className="h-5 w-5 text-indigo-500" />
          Quick Start
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {[
            { step: '1', text: 'Paste a Find API URL above' },
            { step: '2', text: 'Edit params if needed' },
            { step: '3', text: 'Click "Analyze"' },
            { step: '4', text: 'Explore results & facets' },
            { step: '5', text: 'Click "Score" for details' },
          ].map((item) => (
            <div
              key={item.step}
              className="flex items-center gap-3 bg-gray-50 rounded-xl px-4 py-3 border border-gray-100 hover:border-indigo-200 hover:bg-indigo-50 transition-colors duration-200"
            >
              <span className="flex-shrink-0 w-7 h-7 rounded-full bg-indigo-600 text-white text-sm font-bold flex items-center justify-center">
                {item.step}
              </span>
              <span className="text-sm text-gray-700 font-medium">{item.text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Feature Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            icon: Search,
            title: 'API Analysis',
            desc: 'Deep dive into any Find API response structure',
            gradient: 'from-blue-500 to-blue-600',
            bg: 'bg-blue-50',
            ring: 'ring-blue-100',
          },
          {
            icon: BarChart2,
            title: 'Score Breakdown',
            desc: 'Understand how relevance scores are calculated',
            gradient: 'from-emerald-500 to-emerald-600',
            bg: 'bg-emerald-50',
            ring: 'ring-emerald-100',
          },
          {
            icon: Filter,
            title: 'Facet Analysis',
            desc: 'Explore available filters and distributions',
            gradient: 'from-purple-500 to-purple-600',
            bg: 'bg-purple-50',
            ring: 'ring-purple-100',
          },
          {
            icon: Code,
            title: 'Debug Info',
            desc: 'View search engine internals and thresholds',
            gradient: 'from-amber-500 to-amber-600',
            bg: 'bg-amber-50',
            ring: 'ring-amber-100',
          },
        ].map((feature) => (
          <div
            key={feature.title}
            className={`group relative overflow-hidden rounded-2xl ${feature.bg} ring-1 ${feature.ring} p-5 hover:shadow-md transition-all duration-300 hover:-translate-y-0.5`}
          >
            <div
              className={`inline-flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br ${feature.gradient} shadow-sm mb-3`}
            >
              <feature.icon className="h-5 w-5 text-white" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-1">{feature.title}</h4>
            <p className="text-sm text-gray-600 leading-relaxed">{feature.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};