import React from 'react';
import { FaShieldAlt, FaClock, FaCheckCircle, FaBullseye } from 'react-icons/fa';

const performanceData = {
  averageSlashingReceived: { ssv: 0.02, regular: 0.15 },
  uptime: { ssv: 99.98, regular: 99.5 },
  proposalSuccessRate: { ssv: 99.9, regular: 98.5 },
  attestationEffectiveness: { ssv: 99.95, regular: 99.2 }
};

function Dashboard() {
  return (
    <div className="card performance-comparison">
      <h2>Average Validator Performance Comparison</h2>
      <h3>SSV Validator VS Regular Validator</h3>
      <div className="dashboard">
        {Object.entries(performanceData).map(([key, value]) => (
          <DashboardItem
            key={key}
            icon={getIcon(key)}
            title={formatTitle(key)}
            ssvValue={value.ssv}
            regularValue={value.regular}
            lowerIsBetter={key === 'averageSlashingReceived'}
          />
        ))}
      </div>
    </div>
  );
}

function DashboardItem({ icon, title, ssvValue, regularValue, lowerIsBetter = false }) {
  const isSsvBetter = lowerIsBetter ? 
    parseFloat(ssvValue) < parseFloat(regularValue) : 
    parseFloat(ssvValue) > parseFloat(regularValue);

  return (
    <div className="dashboard-item">
      <div className="dashboard-icon">{icon}</div>
      <h3>{title}</h3>
      <div className="dashboard-values">
        <div className={`dashboard-value ssv ${isSsvBetter ? 'better' : ''}`}>
          <span className="value-label">SSV:</span>
          <span className="value-number">{formatValue(ssvValue)}</span>
        </div>
        <div className={`dashboard-value regular ${!isSsvBetter ? 'better' : ''}`}>
          <span className="value-label">Regular:</span>
          <span className="value-number">{formatValue(regularValue)}</span>
        </div>
      </div>
    </div>
  );
}

function getIcon(key) {
  const iconStyle = { fontSize: '3rem', marginBottom: '1rem' };
  switch (key) {
    case 'averageSlashingReceived': return <FaShieldAlt style={iconStyle} />;
    case 'uptime': return <FaClock style={iconStyle} />;
    case 'proposalSuccessRate': return <FaCheckCircle style={iconStyle} />;
    case 'attestationEffectiveness': return <FaBullseye style={iconStyle} />;
    default: return null;
  }
}

function formatTitle(key) {
  return key.split(/(?=[A-Z])/).map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
}

function formatValue(value) {
  return typeof value === 'number' ? `${value.toFixed(2)}%` : value;
}

export default Dashboard;