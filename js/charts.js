let batchChart = null;

export function renderBatchChart(results, strategyName) {
  const canvas = document.getElementById("batch-chart");
  const labels = results.map(result => `${result.hp}%`);
  const data = results.map(result => result.probability * 100);

  if (!canvas) {
    console.error("Could not find #batch-chart canvas.");
    return;
  }

  const ctx = canvas.getContext("2d");

  if (batchChart) {
    batchChart.data.labels = labels;
    batchChart.data.datasets[0].data = data;
    batchChart.data.datasets[0].label = `${strategyName} – skip success rate (%)`;
    batchChart.update();
    return;
  }

  batchChart = new Chart(ctx, {
    type: "line",
    data: {
      labels,
      datasets: [
        {
          label: `${strategyName} – skip success rate (%)`,
          data,
          tension: 0.2
        }
      ]
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true,
          max: 100,
          title: {
            display: true,
            text: "Success Rate (%)"
          }
        },
        x: {
          title: {
            display: true,
            text: "Verzik HP"
          }
        }
      }
    }
  });
}