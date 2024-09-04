import React from 'react';
import Summary from './Summary';
import Recommendations from './Recommendations';
import Charts from './Charts';

const Analysis = React.forwardRef(({ selectedOperators, isVisible }, ref) => {
  if (!isVisible) return null;

  return (
    <div ref={ref} className="analysis card">
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
});

Analysis.displayName = 'Analysis';

export default Analysis;