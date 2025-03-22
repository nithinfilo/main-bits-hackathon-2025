import React, { useState } from 'react';
import { Brain, AlertTriangle } from 'lucide-react';

const Summary = ({ summary, error }) => {
  const [showAll, setShowAll] = useState(false);

  if (error) {
    return (
      <div className="alert alert-error">
        <AlertTriangle className="h-6 w-6" />
        <div>
          <h3 className="font-bold">Error</h3>
          <div className="text-sm">{error}</div>
        </div>
      </div>
    );
  }

  if (!summary) return null;

  const fields = summary.fields || [];

  const capitalizeFirstLetter = (string) => {
    if (typeof string !== 'string' || string.length === 0) return '';
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  const visibleFields = showAll ? fields : fields.slice(0, 4);

  return (
    <div className="card w-full bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden">
      <div className="card-body">
        <div className="flex items-center space-x-3">
          <div className="bg-purple-700 p-2 rounded-lg">
            <Brain className="w-6 h-6 text-purple-300" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-white">AI-Powered Summary</h3>
            <p className="text-sm text-gray-400">Instant dataset insights</p>
          </div>
        </div>
        {summary.dataset_description && (
          <p className="text-sm text-base-content opacity-70 mb-6 mt-4">{summary.dataset_description}</p>
        )}
        <div className="divider">Fields</div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 mb-4">
          {visibleFields.map((field, index) => (
            <div key={index} className="card bg-base-200 hover:bg-base-300 transition-colors duration-200 shadow-lg hover:shadow-xl border border-white/20">
              <div className="card-body p-4">
                <h3 className="card-title text-white text-lg">{capitalizeFirstLetter(field.column)}</h3>
                <p className="text-sm opacity-70">Description: {capitalizeFirstLetter(field.properties?.description || 'No description available')}</p>
              </div>
            </div>
          ))}
        </div>
        {fields.length > 4 && (
          <button 
            className="btn btn-white btn-outline w-full mt-4 hover:glow"
            onClick={() => setShowAll(!showAll)}
          >
            {showAll ? 'Show Less' : 'Show More'}
          </button>
        )}
      </div>
    </div>
  );
};

export default Summary;

const styles = `
  @keyframes glow {
    0% {
      box-shadow: 0 0 5px #9333ea, 0 0 10px #9333ea, 0 0 15px #9333ea, 0 0 20px #9333ea;
    }
    100% {
      box-shadow: 0 0 10px #9333ea, 0 0 20px #9333ea, 0 0 30px #9333ea, 0 0 40px #9333ea;
    }
  }

  .hover\\:glow:hover {
    animation: glow 1.5s ease-in-out infinite alternate;
  }
`