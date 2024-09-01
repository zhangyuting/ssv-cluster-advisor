import React from 'react';

function Recommendations({ selectedOperators }) {
  const recommendations = [
    "Consider increasing your stake to improve rewards",
    "Diversify your operator selection for better resilience",
    "Monitor network fees to optimize costs"
  ];

  // 根据 selectedOperators 添加动态建议
  if (selectedOperators.length < 3) {
    recommendations.push("Consider selecting more operators for better decentralization");
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