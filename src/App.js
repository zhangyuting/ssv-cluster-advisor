import React, { useState, useRef, useEffect } from 'react';
import Dashboard from './components/Dashboard';
import ExistingValidatorForm from './components/ExistingValidatorForm';
import NewValidatorForm from './components/NewValidatorForm';
import Analysis from './components/Analysis';
import './styles.css';
import Introduction from './components/Introduction';
import Summary from './components/Summary';

function App() {
  const [mode, setMode] = useState(null);
  const [selectedOperators, setSelectedOperators] = useState([]);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const analysisRef = useRef(null);

  const handleAnalyze = () => {
    setShowAnalysis(true);
    setTimeout(() => {
      if (analysisRef.current) {
        analysisRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  const renderContent = () => {
    if (!mode) {
      return (
        <div className="card mode-selection">
          <h2>Choose an option:</h2>
          <div className="button-group">
            <button className="button" onClick={() => setMode('existing')}>Evaluate Existing Validator</button>
            <button className="button" onClick={() => setMode('new')}>Create New Validator</button>
          </div>
        </div>
      );
    }

    return (
      <div className="content-wrapper">
        <div className="card">
          <h2>{mode === 'existing' ? 'Evaluate Existing Validator' : 'Create New Validator'}</h2>
          {mode === 'existing' ? (
            <ExistingValidatorForm setSelectedOperators={setSelectedOperators} onAnalyze={handleAnalyze} />
          ) : (
            <NewValidatorForm setSelectedOperators={setSelectedOperators} onAnalyze={handleAnalyze} />
          )}
        </div>
        {(mode === 'new' || showAnalysis) && selectedOperators.length > 0 && (
          <Analysis ref={analysisRef} selectedOperators={selectedOperators} isVisible={showAnalysis} />
        )}
      </div>
    );
  };

  return (
    <div className="container">
      <h1>SSV Cluster Advisor</h1>
      <Introduction />
      <Dashboard />
      {renderContent()}
      {/* {selectedOperators.length > 0 && (
        <Summary selectedOperators={selectedOperators} />
      )} */}
    </div>
  );
}

export default App;