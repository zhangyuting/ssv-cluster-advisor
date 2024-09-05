import { FaGlobe, FaServer, FaHdd, FaUsers } from 'react-icons/fa';
import React from 'react';
import { calculateScores, calculateOverallScore } from './Charts';

function Summary({ selectedOperators }) {
  const scores = calculateScores(selectedOperators);
  const overallScore = calculateOverallScore(scores);

  return (
    <div className="summary">
      <h2>Summary</h2>
      <p>Overall Score: <span className="highlight">{overallScore.toFixed(1)}%</span></p>
      <p>Number of Operators: <span className="highlight">{selectedOperators.length}</span></p>
      <p>Fault Tolerance: <span className="highlight">{Math.floor((selectedOperators.length - 1) / 3)}</span></p>
      
      <h3>Selected Operators</h3>
      <div className="table-container">
        <table className="operators-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Operator</th>
              <th>Location</th>
              <th>Setup Provider</th>
              <th>Clients (ETH1/ETH2)</th>
              <th>MEV Relays</th>
              <th>Annual Fee</th>
            </tr>
          </thead>
          <tbody>
            {selectedOperators.map((operator, index) => (
              <tr key={operator.id}>
                <td>{index + 1}</td>
                <td>{operator.name}</td>
                <td>{operator.location}</td>
                <td>{operator.setup_provider}</td>
                <td>{`${operator.eth1_node_client}/${operator.eth2_node_client}`}</td>
                <td>{Array.isArray(operator.mev_relays) ? operator.mev_relays.join(', ') : (operator.mev_relays || 'N/A')}</td>
                <td>{`${((parseInt(operator.fee) * 365 * 24 * 60 * 5) / 1e18).toFixed(2)} SSV`}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Summary;