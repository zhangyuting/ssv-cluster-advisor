import React, { useState, useEffect } from 'react';
import { FaCheckCircle } from 'react-icons/fa';
import operators from '../data/operators.json';

function NewValidatorForm({ setSelectedOperators, onAnalyze }) {
  const [operatorCount, setOperatorCount] = useState(4);
  const [sortCriteria, setSortCriteria] = useState('performance');
  const [recommendedOperators, setRecommendedOperators] = useState([]);
  const [feeRange, setFeeRange] = useState('all');

  useEffect(() => {
    let filteredOperators = [...operators];

    // Filter by fee range
    if (feeRange !== 'all') {
      const [min, max] = feeRange.split('-').map(Number);
      filteredOperators = filteredOperators.filter(op => {
        const annualFee = (parseInt(op.fee) * 365 * 24 * 60 * 5) / 1e18;
        return annualFee >= min && (max === '+' || annualFee <= max);
      });
    }

    // Sort operators
    filteredOperators.sort((a, b) => {
      if (sortCriteria === 'performance') {
        return b.performance['24h'] - a.performance['24h'];
      } else if (sortCriteria === 'fee') {
        return parseInt(a.fee) - parseInt(b.fee);
      }
      return 0;
    });

    setRecommendedOperators(filteredOperators.slice(0, operatorCount));
  }, [operatorCount, sortCriteria, feeRange]);

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
        <select className="select-input" value={feeRange} onChange={(e) => setFeeRange(e.target.value)}>
          <option value="all">All Fees</option>
          <option value="0-1">0 - 1 SSV</option>
          <option value="1-5">1 - 5 SSV</option>
          <option value="5-10">5 - 10 SSV</option>
          <option value="10-20">10 - 20 SSV</option>
          <option value="20+">20+ SSV</option>
        </select>
      </div>
      <div className="recommended-operators-container">
        <div className="recommended-operators-horizontal">
          {recommendedOperators.map((operator, index) => (
            <div key={operator.id} className="operator-card">
              {operator.logo && <img src={operator.logo} alt={`${operator.name} logo`} className="operator-logo" />}
              <h3>{operator.name}</h3>
              {operator.type === 'verified_operator' && (
                <div className="verified-operator-badge">
                  <FaCheckCircle className="verified-icon" />
                  <span>Verified Operator</span>
                </div>
              )}
              <p className="location">Location: <span className="highlight">{operator.location || 'N/A'}</span></p>
              <p className="performance">Performance (24h): <span className="highlight">{operator.performance['24h'].toFixed(2)}%</span></p>
              <p className="fee">Annual Fee: <span className="highlight">{((parseInt(operator.fee) * 365 * 24 * 60 * 5) / 1e18).toFixed(2)} SSV</span></p>
              <p className="validators">Validators: <span className="highlight">{operator.validators_count}</span></p>
              <p className="setup">Setup: <span className="highlight">{operator.setup_provider}</span></p>
              <p className="clients">Clients: <span className="highlight">{operator.eth1_node_client} / {operator.eth2_node_client}</span></p>
              <p className="mev-relays">MEV Relays: <span className="highlight">{operator.mev_relays}</span></p>
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