import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import axios from 'axios';
import { FaCheckCircle } from 'react-icons/fa';

function ExistingValidatorForm({ setSelectedOperators, onAnalyze }) {
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [options, setOptions] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (searchTerm) {
      fetchOperators(searchTerm);
    }
  }, [searchTerm]);

  const fetchOperators = async (search) => {
    try {
      const response = await axios.get(`https://api.ssv.network/api/v4/mainnet/operators?page=1&perPage=10&search=${search}`);
      const operators = response.data.operators.map(op => ({
        value: op.id,
        label: `${op.id} - ${op.name}`,
        logo: op.logo || '',
        performance: op.performance,
        fee: op.fee,
        annualFee: ((parseInt(op.fee) * 365 * 24 * 60 * 5) / 1e18).toFixed(2),
        validators_count: op.validators_count,
        setup_provider: op.setup_provider,
        eth1_node_client: op.eth1_node_client,
        eth2_node_client: op.eth2_node_client,
        mev_relays: op.mev_relays ? (Array.isArray(op.mev_relays) ? op.mev_relays : op.mev_relays.split(',').map(relay => relay.trim())) : [],
        location: op.location || 'N/A',
        type: op.type // Add this line to include the type property
      }));
      const mergedOptions = [...new Set([...selectedOptions, ...operators])];
      setOptions(mergedOptions);
    } catch (error) {
      console.error('Error fetching operators:', error);
    }
  };

  const handleChange = (selectedOptions) => {
    setSelectedOptions(selectedOptions);
    const selectedOps = selectedOptions.map(option => {
      const fullOperator = options.find(op => op.value === option.value);
      return {
        ...fullOperator,
        name: fullOperator.label.split(' - ')[1] // Add this line to ensure 'name' is set
      };
    });
    setSelectedOperators(selectedOps);
  };

  const isValidOperatorCount = (count) => {
    return [4, 7, 10, 13].includes(count);
  };

  const handleAnalyze = () => {
    if (isValidOperatorCount(selectedOptions.length)) {
      onAnalyze();
    }
  };

  return (
    <div className="existing-validator-form">
      <Select
        isMulti
        options={options}
        value={selectedOptions}
        inputValue={searchTerm}
        onInputChange={(inputValue, { action }) => {
          if (action === 'input-change') {
            setSearchTerm(inputValue);
          }
        }}
        onChange={handleChange}
        placeholder="Select or search operators..."
        className="select-input"
      />
      <div className="recommended-operators-container">
        <div className="recommended-operators-horizontal">
          {selectedOptions.map(option => {
            const operator = options.find(op => op.value === option.value);
            if (!operator) return null; // Ensure operator is defined
            return (
              <div key={operator.value} className="operator-card">
                {operator.logo && <img src={operator.logo} alt={`${operator.label} logo`} className="operator-logo" />}
                <h3>{operator.label}</h3>
                {operator.type === 'verified_operator' && (
                  <div className="verified-operator-badge">
                    <FaCheckCircle className="verified-icon" />
                    <span>Verified Operator</span>
                  </div>
                )}
                <p className="location">Location: <span className="highlight">{operator.location}</span></p>
                <p className="performance">Performance (24h): <span className="highlight">{operator.performance?.['24h']?.toFixed(2)}%</span></p>
                <p className="fee">Annual Fee: <span className="highlight">{((parseInt(operator.fee) * 365 * 24 * 60 * 5) / 1e18).toFixed(2)} SSV</span></p>
                <p className="validators">Validators: <span className="highlight">{operator.validators_count}</span></p>
                <p className="setup">Setup: <span className="highlight">{operator.setup_provider}</span></p>
                <p className="clients">Clients: <span className="highlight">{operator.eth1_node_client} / {operator.eth2_node_client}</span></p>
                <p className="mev-relays">MEV Relays: <span className="highlight">{operator.mev_relays.join(', ')}</span></p>
              </div>
            );
          })}
        </div>
      </div>
      <button 
        className="button" 
        onClick={handleAnalyze} 
        disabled={!isValidOperatorCount(selectedOptions.length)}
      >
        Analyze Selected Operators
      </button>
      {!isValidOperatorCount(selectedOptions.length) && (
        <p className="error-message">Please select 4, 7, 10, or 13 operators to analyze.</p>
      )}
    </div>
  );
}

export default ExistingValidatorForm;