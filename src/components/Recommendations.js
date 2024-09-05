import React from 'react';

function Recommendations({ selectedOperators, scores }) {
  const recommendations = [];

  if (scores.geographicScore < 50) {
    recommendations.push("Consider selecting operators from different geographic regions to improve geographic diversity.");
  }

  if (scores.infrastructureDiversityScore < 50) {
    recommendations.push("Choose operators using different infrastructure providers to enhance infrastructure diversity.");
  }

  if (scores.softwareDiversityScore < 50) {
    recommendations.push("Select operators using a mix of different Ethereum clients to increase software diversity and resilience.");
  }

  if (scores.dutyPerformanceScore < 95) {
    recommendations.push("Consider replacing underperforming operators with those having higher duty performance scores.");
  }

  if (scores.censorshipResistanceScore < 70) {
    recommendations.push("Select operators with diverse MEV relay connections to enhance censorship resistance.");
  }

  if (scores.verifiedOperatorScore < 50) {
    recommendations.push("Include more verified operators to increase trust and reliability.");
  }

  if (scores.economicModelScore < 70) {
    recommendations.push("Review and optimize your selection based on operator fees to improve the economic model score.");
  }

  if (scores.faultToleranceScore < 66) {
    recommendations.push("Consider adding more operators to improve fault tolerance.");
  }

  if (selectedOperators.length < 4) {
    recommendations.push("Increase the number of operators to at least 4 for better decentralization and fault tolerance.");
  }

  return (
    <div className="recommendations">
      <h2>Optimization Recommendations</h2>
      <ul>
        {recommendations.map((rec, index) => (
          <li key={index}>{rec}</li>
        ))}
      </ul>
    </div>
  );
}

export default Recommendations;