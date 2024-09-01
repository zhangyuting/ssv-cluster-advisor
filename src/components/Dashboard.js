import React from 'react';
import { FaGlobe, FaServer, FaHdd, FaUsers } from 'react-icons/fa';

const globalDiversityData = {
  geographicDiversity: 85.5,
  softwareDiversity: 78.2,
  hardwareDiversity: 72.8,
  operatorDiversity: 90.1
};

function Dashboard() {
  return (
    <div className="card">
      <h2>Global Validator Diversity</h2>
      <div className="dashboard">
        <DashboardItem icon={<FaGlobe />} title="Geographic Diversity" value={`${globalDiversityData.geographicDiversity.toFixed(1)}%`} />
        <DashboardItem icon={<FaServer />} title="Software Diversity" value={`${globalDiversityData.softwareDiversity.toFixed(1)}%`} />
        <DashboardItem icon={<FaHdd />} title="Hardware Diversity" value={`${globalDiversityData.hardwareDiversity.toFixed(1)}%`} />
        <DashboardItem icon={<FaUsers />} title="Operator Diversity" value={`${globalDiversityData.operatorDiversity.toFixed(1)}%`} />
      </div>
    </div>
  );
}

function DashboardItem({ icon, title, value }) {
  return (
    <div className="dashboard-item">
      <div className="dashboard-icon">{icon}</div>
      <h3>{title}</h3>
      <p className="dashboard-value">{value}</p>
    </div>
  );
}

export default Dashboard;