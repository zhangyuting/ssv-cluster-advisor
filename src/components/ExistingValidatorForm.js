import React, { useState } from 'react';
import Select from 'react-select';
import { operators } from '../data/operators';

function ExistingValidatorForm({ setSelectedOperators, onAnalyze }) {
  const [selectedOptions, setSelectedOptions] = useState([]);

  const options = operators.map(op => ({
    value: op.id,
    label: `${op.id} - ${op.name}`
  }));

  const handleChange = (selectedOptions) => {
    setSelectedOptions(selectedOptions);
    const selectedOps = operators.filter(op => selectedOptions.some(option => option.value === op.id));
    setSelectedOperators(selectedOps);
  };

  const handleAnalyze = () => {
    if (selectedOptions.length > 0) {
      onAnalyze();
    }
  };

  return (
    <div className="existing-validator-form">
      <Select
        isMulti
        options={options}
        value={selectedOptions}
        onChange={handleChange}
        placeholder="Select or search operators..."
        className="select-input"
      />
      <div className="recommended-operators-container">
        <div className="recommended-operators-horizontal">
          {selectedOptions.map(option => {
            const operator = operators.find(op => op.id === option.value);
            return (
              <div key={operator.id} className="operator-card">
                <img src={operator.logo} alt={`${operator.name} logo`} className="operator-logo" />
                <h3>{operator.name}</h3>
                <p>Performance (24h): <span className="highlight">{operator.performance['24h'].toFixed(2)}%</span></p>
                <p>Fee: <span className="highlight">{(parseInt(operator.fee) / 1e9).toFixed(6)} ETH</span></p>
                <p>Validators: <span className="highlight">{operator.validators_count}</span></p>
                <p>Setup: <span className="highlight">{operator.setup_provider}</span></p>
                <p>Clients: <span className="highlight">{operator.eth1_node_client} / {operator.eth2_node_client}</span></p>
              </div>
            );
          })}
        </div>
      </div>
      <button className="button" onClick={handleAnalyze} disabled={selectedOptions.length === 0}>
        Analyze Selected Operators
      </button>
    </div>
  );
}

export default ExistingValidatorForm;