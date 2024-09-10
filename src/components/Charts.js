import React, { useEffect, useRef } from 'react';
import { Chart } from 'chart.js/auto';
import { FaInfoCircle } from 'react-icons/fa';

function formatMetricName(key) {
    return key
        .replace(/([A-Z])/g, ' $1')
        .replace(/^./, str => str.toUpperCase())
        .replace(/Score$/, '');
}

function Charts({ selectedOperators }) {
    const radarChartRef = useRef(null);

    useEffect(() => {
        if (radarChartRef.current && selectedOperators.length > 0) {
            const radarCtx = radarChartRef.current.getContext('2d');

            const chartOptions = {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        callbacks: {
                            label: function (context) {
                                return `${context.label}: ${context.raw.toFixed(1)}%`;
                            }
                        }
                    }
                },
                scales: {
                    r: {
                        angleLines: {
                            color: 'rgba(0, 0, 0, 0.1)'
                        },
                        suggestedMin: 0,
                        suggestedMax: 100,
                        ticks: {
                            stepSize: 20,
                            font: {
                                size: 14
                            },
                            color: 'rgba(0, 0, 0, 0.7)'
                        },
                        pointLabels: {
                            font: {
                                size: 14,
                                weight: 'bold'
                            },
                            color: 'rgba(0, 0, 0, 0.8)'
                        }
                    }
                },
                elements: {
                    point: {
                        radius: 4,
                        hoverRadius: 6
                    },
                    line: {
                        tension: 0.2
                    }
                }
            };

            const radarChart = new Chart(radarCtx, {
                type: 'radar',
                data: {
                    labels: [
                        'Geographic Diversity',
                        'Infrastructure Diversity',
                        'Software Diversity',
                        'Duty Performance',
                        'Censorship Resistance',
                        'Verified Operators',
                        'Economic Model',
                        'Fault Tolerance'
                    ],
                    datasets: [{
                        label: 'Cluster Score',
                        data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                        backgroundColor: 'rgba(75, 192, 192, 0.2)',
                        borderColor: 'rgba(75, 192, 192, 1)',
                        pointBackgroundColor: 'rgba(75, 192, 192, 1)',
                        pointBorderColor: '#fff',
                        pointHoverBackgroundColor: '#fff',
                        pointHoverBorderColor: 'rgba(75, 192, 192, 1)'
                    }]
                },
                options: {
                    ...chartOptions,
                    scales: {
                        r: {
                            ...chartOptions.scales.r,
                            angleLines: {
                                display: false
                            },
                            ticks: {
                                ...chartOptions.scales.r.ticks,
                                stepSize: 20
                            }
                        }
                    }
                }
            });

            return () => {
                radarChart.destroy();
            };
        }
    }, []);

    useEffect(() => {
        if (radarChartRef.current && selectedOperators.length > 0) {
            const radarChart = Chart.getChart(radarChartRef.current);

            if (radarChart) {
                const scores = calculateScores(selectedOperators);
                radarChart.data.datasets[0].data = Object.values(scores);
                radarChart.update();
            }
        }
    }, [selectedOperators]);

    return (
        <div className="analysis-section-content">
            <h2 className="section-title">Cluster Analysis</h2>
            <div className="cluster-analysis-container">
                <div className="radar-chart-wrapper">
                    <canvas ref={radarChartRef}></canvas>
                </div>
                <div className="table-wrapper">
                    <table className="cluster-analysis-table">
                        <thead>
                            <tr>
                                <th>Diversity Metrics</th>
                                <th>Score</th>
                            </tr>
                        </thead>
                        <tbody>
                            {selectedOperators.length > 0 && Object.entries(calculateScores(selectedOperators)).map(([key, value]) => (
                                <tr key={key}>
                                    <td>
                                        <div className="metric-container">
                                            {formatMetricName(key)}
                                            <span className="tooltip">
                                                <FaInfoCircle className="info-icon" />
                                                <span className="tooltiptext">
                                                    <strong>Description:</strong> {metricDescriptions[key].description}<br />
                                                    <strong>Suggestion:</strong> {metricDescriptions[key].suggestion}
                                                </span>
                                            </span>
                                        </div>
                                    </td>
                                    <td style={{ backgroundColor: getScoreColor(value) }}>{value.toFixed(1)}%</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

const metricDescriptions = {
    geographicScore: {
        description: "Measures the diversity of operator locations.",
        suggestion: "Select operators from different geographic regions to improve this score."
    },
    infrastructureDiversityScore: {
        description: "Evaluates the variety of infrastructure providers used by operators.",
        suggestion: "Choose operators using different infrastructure providers to enhance diversity."
    },
    softwareDiversityScore: {
        description: "Assesses the diversity of Ethereum clients used by operators.",
        suggestion: "Select operators using a mix of different Ethereum clients to increase resilience."
    },
    dutyPerformanceScore: {
        description: "Reflects the average performance of operators in fulfilling their duties.",
        suggestion: "Choose operators with high performance ratings to improve this score."
    },
    censorshipResistanceScore: {
        description: "Measures the resistance to censorship based on MEV relay diversity.",
        suggestion: "Select operators with diverse MEV relay connections to enhance censorship resistance."
    },
    verifiedOperatorScore: {
        description: "Indicates the proportion of verified operators in your selection.",
        suggestion: "Include more verified operators to increase trust and reliability."
    },
    economicModelScore: {
        description: "Evaluates the balance and diversity of operator fees.",
        suggestion: "Choose operators with a mix of fee structures to optimize this score."
    },
    faultToleranceScore: {
        description: "Measures the cluster's ability to withstand operator failures.",
        suggestion: "Increase the number of operators to improve fault tolerance."
    }
};

function calculateScores(operators) {
    return {
        geographicScore: calculateGeographicScore(operators),
        infrastructureDiversityScore: calculateInfrastructureDiversityScore(operators),
        softwareDiversityScore: calculateSoftwareDiversityScore(operators),
        dutyPerformanceScore: calculateDutyPerformanceScore(operators),
        censorshipResistanceScore: calculateCensorshipResistanceScore(operators),
        verifiedOperatorScore: calculateVerifiedOperatorScore(operators),
        economicModelScore: calculateEconomicModelScore(operators),
        faultToleranceScore: calculateFaultToleranceScore(operators.length)
    };
}

function calculateInfrastructureDiversityScore(operators) {
    const uniqueProviders = new Set(operators.map(op => op.setup_provider));
    return (uniqueProviders.size / operators.length) * 100;
}

function calculateGeographicScore(operators) {
    const uniqueLocations = new Set(operators.map(op => op.location));
    return (uniqueLocations.size / operators.length) * 100;
}

function calculateNetworkDiversityScore(operators) {
    const uniqueProviders = new Set(operators.map(op => op.setup_provider));
    return (uniqueProviders.size / operators.length) * 100;
}

function calculateHardwareDiversityScore(operators) {
    // 由于没有具体的硬件信息，我们可以基于设置提供商来估算
    const uniqueProviders = new Set(operators.map(op => op.setup_provider));
    return (uniqueProviders.size / operators.length) * 100;
}

function calculateSoftwareDiversityScore(operators) {
    const uniqueClients = new Set([
        ...operators.map(op => op.eth1_node_client),
        ...operators.map(op => op.eth2_node_client)
    ]);
    return (uniqueClients.size / (operators.length * 2)) * 100;
}

function calculateOperatorDiversityScore(operators) {
    return Math.min(100, (operators.length / 13) * 100); // 假设13个作员为满分
}

function calculateDutyPerformanceScore(operators) {
    return operators.reduce((sum, op) => sum + op.performance['24h'], 0) / operators.length;
}

function calculateCensorshipResistanceScore(operators) {
    const avgMevRelays = operators.reduce((score, op) => {
        const relays = op.mev_relays ? (Array.isArray(op.mev_relays) ? op.mev_relays : op.mev_relays.split(',').map(relay => relay.trim())) : [];
        return score + (relays.length > 0 ? 1 : 0);
    }, 0);
    return Math.min(100, (avgMevRelays / 8) * 100); // 假设平均8个MEV中继为满分
}

function calculateVerifiedOperatorScore(operators) {
    const verifiedCount = operators.filter(op => op.type === 'verified_operator').length;
    return (verifiedCount / operators.length) * 100;
}

function calculateEconomicModelScore(operators) {
    const fees = operators.map(op => parseInt(op.fee));
    const avgFee = fees.reduce((sum, fee) => sum + fee, 0) / operators.length;
    const feeVariance = fees.reduce((sum, fee) => sum + Math.pow(fee - avgFee, 2), 0) / operators.length;
    const feeStandardDeviation = Math.sqrt(feeVariance);

    // Normalize fee standard deviation (higher diversity is better, up to a point)
    const feeDiversityScore = Math.min(100, (feeStandardDeviation / 1e10) * 100);

    // Calculate fee reasonableness (closer to average is better)
    const feeReasonablenessScore = 100 - Math.min(100, Math.abs(avgFee - 1e11) / 1e9);

    // Combine diversity and reasonableness scores
    return (feeDiversityScore * 0.5) + (feeReasonablenessScore * 0.5);
}

function calculateFaultToleranceScore(clusterSize) {
    // A cluster of 4 operators can tolerate 1 fault, 7 can tolerate 2, etc.
    const faultTolerance = Math.floor((clusterSize - 1) / 3);
    return Math.min(100, (faultTolerance / 3) * 100); // Assume 3 faults tolerated is optimal
}

function calculateOverallScore(scores) {
    const scoreValues = Object.values(scores);
    return scoreValues.reduce((sum, score) => sum + score, 0) / scoreValues.length;
}

function getScoreColor(score) {
    if (score >= 80) return 'rgba(0, 255, 0, 0.1)'; // Light green for high scores
    if (score >= 60) return 'rgba(255, 255, 0, 0.1)'; // Light yellow for medium scores
    if (score >= 40) return 'rgba(255, 165, 0, 0.1)'; // Light orange for low scores
    return 'rgba(255, 0, 0, 0.1)'; // Light red for very low scores
}

export { calculateScores, calculateOverallScore };
export default Charts;