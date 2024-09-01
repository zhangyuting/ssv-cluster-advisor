import React, { useEffect, useRef } from 'react';
import { Chart } from 'chart.js/auto';

function Charts({ selectedOperators }) {
    const radarChartRef = useRef(null);
    const overallScoreChartRef = useRef(null);

    useEffect(() => {
        if (radarChartRef.current && overallScoreChartRef.current) {
            // Destroy existing charts
            const existingRadarChart = Chart.getChart(radarChartRef.current);
            if (existingRadarChart) {
                existingRadarChart.destroy();
            }
            const existingOverallScoreChart = Chart.getChart(overallScoreChartRef.current);
            if (existingOverallScoreChart) {
                existingOverallScoreChart.destroy();
            }

            const radarCtx = radarChartRef.current.getContext('2d');
            const overallScoreCtx = overallScoreChartRef.current.getContext('2d');

            new Chart(radarCtx, {
                type: 'radar',
                data: {
                    labels: ['Geographic', 'Network Diversity', 'Hardware Diversity', 'Software Diversity', 'Operator Diversity', 'Reputation', 'Censorship Resistance', 'Verified Operators', 'Economic Model', 'Cluster Size'],
                    datasets: [{
                        label: 'Cluster Analysis',
                        data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                        fill: true,
                        backgroundColor: 'rgba(255, 99, 132, 0.2)',
                        borderColor: 'rgb(255, 99, 132)',
                        pointBackgroundColor: 'rgb(255, 99, 132)',
                        pointBorderColor: '#fff',
                        pointHoverBackgroundColor: '#fff',
                        pointHoverBorderColor: 'rgb(255, 99, 132)'
                    }]
                },
                options: {
                    elements: {
                        line: {
                            borderWidth: 3
                        }
                    }
                }
            });

            new Chart(overallScoreCtx, {
                type: 'doughnut',
                data: {
                    labels: ['Score', 'Remaining'],
                    datasets: [{
                        data: [0, 100],
                        backgroundColor: ['rgba(75, 192, 192, 0.8)', 'rgba(201, 203, 207, 0.8)']
                    }]
                },
                options: {
                    cutout: '70%',
                    plugins: {
                        legend: {
                            display: false
                        },
                        tooltip: {
                            enabled: false
                        }
                    },
                    plugins: [{
                        id: 'centerText',
                        afterDraw: (chart) => {
                            const ctx = chart.ctx;
                            const width = chart.width;
                            const height = chart.height;
                            ctx.restore();
                            const fontSize = (height / 114).toFixed(2);
                            ctx.font = fontSize + "em sans-serif";
                            ctx.textBaseline = "middle";
                            ctx.textAlign = "center";
                            const text = chart.data.datasets[0].data[0].toFixed(2);
                            const textX = width / 2;
                            const textY = height / 2;
                            ctx.fillText(text, textX, textY);
                            ctx.save();
                        }
                    }]
                }
            });
        }
    }, []);

    useEffect(() => {
        if (radarChartRef.current && overallScoreChartRef.current && selectedOperators.length > 0) {
            const radarChart = Chart.getChart(radarChartRef.current);
            const overallScoreChart = Chart.getChart(overallScoreChartRef.current);

            if (radarChart && overallScoreChart) {
                const scores = calculateScores(selectedOperators);
                radarChart.data.datasets[0].data = Object.values(scores);
                radarChart.update();

                const overallScore = calculateOverallScore(scores);
                overallScoreChart.data.datasets[0].data = [overallScore, 100 - overallScore];
                overallScoreChart.update();
            }
        }
    }, [selectedOperators]);

    return (
        <div className="charts-container" style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div className="chart" style={{ width: '48%' }}>
                <h2>Cluster Analysis</h2>
                <canvas ref={radarChartRef}></canvas>
            </div>
            <div className="chart" style={{ width: '48%' }}>
                <h2>Overall Score</h2>
                <canvas ref={overallScoreChartRef}></canvas>
            </div>
        </div>
    );
}

function calculateScores(operators) {
    return {
        geographicScore: calculateGeographicScore(operators),
        networkDiversityScore: calculateNetworkDiversityScore(operators),
        hardwareDiversityScore: calculateHardwareDiversityScore(operators),
        softwareDiversityScore: calculateSoftwareDiversityScore(operators),
        operatorDiversityScore: calculateOperatorDiversityScore(operators),
        reputationScore: calculateReputationScore(operators),
        censorshipResistanceScore: calculateCensorshipResistanceScore(operators),
        verifiedOperatorScore: calculateVerifiedOperatorScore(operators),
        economicModelScore: calculateEconomicModelScore(operators),
        clusterSizeScore: calculateClusterSizeScore(operators.length)
    };
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
    return Math.min(100, (operators.length / 10) * 100); // 假设10个操作员为满分
}

function calculateReputationScore(operators) {
    return operators.reduce((sum, op) => sum + op.performance['24h'], 0) / operators.length;
}

function calculateCensorshipResistanceScore(operators) {
    const avgMevRelays = operators.reduce((sum, op) => sum + op.mev_relays.length, 0) / operators.length;
    return Math.min(100, (avgMevRelays / 8) * 100); // 假设平均8个MEV中继为满分
}

function calculateVerifiedOperatorScore(operators) {
    const verifiedCount = operators.filter(op => op.type === 'verified_operator').length;
    return (verifiedCount / operators.length) * 100;
}

function calculateEconomicModelScore(operators) {
    const avgFee = operators.reduce((sum, op) => sum + parseInt(op.fee), 0) / operators.length;
    return Math.min(100, (avgFee / 1e11) * 100); // 假设平均费用1e11 wei为满分
}

function calculateClusterSizeScore(clusterSize) {
    return Math.min(100, (clusterSize / 10) * 100); // 假设10个操作员为满分
}

function calculateOverallScore(scores) {
    return Object.values(scores).reduce((sum, score) => sum + score, 0) / Object.keys(scores).length;
}

export { calculateScores };
export default Charts;