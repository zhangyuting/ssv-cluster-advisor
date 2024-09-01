import React from 'react';
import Summary from './Summary';
import Recommendations from './Recommendations';
import Charts from './Charts';

function Analysis({ selectedOperators, isVisible }) {
  if (!isVisible) return null;

  return (
    <div className="analysis card">
      <h2>Analysis Results</h2>
      <div className="analysis-grid">
        <div className="analysis-item">
          <Summary selectedOperators={selectedOperators} />
        </div>
        <div className="analysis-item">
          <Recommendations selectedOperators={selectedOperators} />
        </div>
        <div className="analysis-item">
          <Charts selectedOperators={selectedOperators} />
        </div>
      </div>
    </div>
  );
}

export default Analysis;