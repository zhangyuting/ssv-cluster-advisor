import React, { useState, useEffect } from 'react';
import { operators } from '../data/operators';

function NewValidatorForm({ setSelectedOperators, onAnalyze }) {
  const [operatorCount, setOperatorCount] = useState(4);
  const [sortCriteria, setSortCriteria] = useState('performance');
  const [recommendedOperators, setRecommendedOperators] = useState([]);

  useEffect(() => {
    const sortedOperators = [...operators].sort((a, b) => {
      if (sortCriteria === 'performance') {
        return b.performance['24h'] - a.performance['24h'];
      } else if (sortCriteria === 'fee') {
        return parseInt(a.fee) - parseInt(b.fee);
      }
      return 0;
    });

    setRecommendedOperators(sortedOperators.slice(0, operatorCount));
  }, [operatorCount, sortCriteria]);

  const handleOperatorReplace = (index) => {
    const newOperators = [...recommendedOperators];
    const nextBestOperator = operators.find(op => !recommendedOperators.includes(op));
    newOperators[index] = nextBestOperator;
    setRecommendedOperators(newOperators);
  };

  const handleUseSelection = () => {
    setSelectedOperators(recommendedOperators);
    onAnalyze();
  };

  return (
    <div className="new-validator-form">
      <div className="controls">
        <select className="select-input" value={operatorCount} onChange={(e) => setOperatorCount(Number(e.target.value))}>
          <option value={4}>4 Operators</option>
          <option value={7}>7 Operators</option>
          <option value={10}>10 Operators</option>
          <option value={13}>13 Operators</option>
        </select>
        <select className="select-input" value={sortCriteria} onChange={(e) => setSortCriteria(e.target.value)}>
          <option value="performance">Sort by Performance</option>
          <option value="fee">Sort by Fee</option>
        </select>
      </div>
      <div className="recommended-operators-container">
        <div className="recommended-operators-horizontal">
          {recommendedOperators.map((operator, index) => (
            <div key={operator.id} className="operator-card">
              <img src={operator.logo} alt={`${operator.name} logo`} className="operator-logo" />
              <h3>{operator.name}</h3>
              <p>Performance: <span className="highlight">{operator.performance['24h'].toFixed(2)}%</span></p>
              <p>Fee: <span className="highlight">{(parseInt(operator.fee) / 1e9).toFixed(6)} ETH</span></p>
              <button className="button button-small" onClick={() => handleOperatorReplace(index)}>Replace</button>
            </div>
          ))}
        </div>
      </div>
      <button className="button" onClick={handleUseSelection}>Use This Selection</button>
    </div>
  );
}

export default NewValidatorForm;