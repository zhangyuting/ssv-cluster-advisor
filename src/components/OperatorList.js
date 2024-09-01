import React, { useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import { operators } from '../data/operators';

function OperatorList({ selectedOperators, setSelectedOperators }) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredOperators = operators.filter(operator =>
    operator.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    operator.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
    operator.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOperatorSelect = (operator) => {
    if (selectedOperators.find(op => op.id === operator.id)) {
      setSelectedOperators(selectedOperators.filter(op => op.id !== operator.id));
    } else {
      setSelectedOperators([...selectedOperators, operator]);
    }
  };

  return (
    <div>
      <div className="search-bar">
        <FaSearch className="search-icon" />
        <input
          type="text"
          placeholder="Search operators..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="operator-list">
        {filteredOperators.map(operator => (
          <div key={operator.id} className="operator-card">
          <img src={operator.logo} alt={`${operator.name} logo`} />
          <h2>{operator.name}</h2>
          <p className="location">Location: {operator.location}</p>
          <p className="performance">Performance (24h): {operator.performance['24h'].toFixed(2)}%</p>
          <p className="fee">Fee: {(parseInt(operator.fee) / 1e9).toFixed(6)} ETH</p>
          <p className="validators">Validators: {operator.validators_count}</p>
          <p className="setup">Setup: {operator.setup_provider}</p>
          <p className="clients">Clients: {operator.eth1_node_client} / {operator.eth2_node_client}</p>
          <label className="checkbox-container">
            <input
              type="checkbox"
              checked={selectedOperators.some(op => op.id === operator.id)}
              onChange={() => handleOperatorSelect(operator)}
            />
            <span className="checkmark"></span>
            Select
          </label>
        </div>
        ))}
      </div>
    </div>
  );
}

export default OperatorList;