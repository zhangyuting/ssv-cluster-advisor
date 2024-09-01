import { FaGlobe, FaServer, FaHdd, FaUsers } from 'react-icons/fa';
import React from 'react';
import { calculateScores } from './Charts';

function Summary({ selectedOperators }) {
  const scores = calculateScores(selectedOperators);

  return (
    <div className="summary">
      <h2>Diversity Metrics</h2>
      <div className="dashboard">
        <div className="dashboard-item">
          <h3>Geographic Diversity</h3>
          <p>{scores.geographicScore.toFixed(2)}%</p>
        </div>
        <div className="dashboard-item">
          <h3>Software Diversity</h3>
          <p>{scores.softwareDiversityScore.toFixed(2)}%</p>
        </div>
        <div className="dashboard-item">
          <h3>Hardware Diversity</h3>
          <p>{scores.hardwareDiversityScore.toFixed(2)}%</p>
        </div>
        <div className="dashboard-item">
          <h3>Operator Diversity</h3>
          <p>{scores.operatorDiversityScore.toFixed(2)}%</p>
        </div>
      </div>
      <p>Selected Operators: {selectedOperators.length}</p>
    </div>
  );
}

export default Summary;