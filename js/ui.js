import { runSim, runBatchSim, STRATEGIES } from "./simulation.js";
import { renderBatchChart } from "./charts.js";

function getSelectedStrategy() {
  const key = document.getElementById("strategy").value;
  return STRATEGIES[key];
}
function runSingle() {
  const trials = Number(document.getElementById("trials").value);
  const hp = Number(document.getElementById("hp").value);
  const outputEl = document.getElementById("output");
  const batchOutputEl = document.getElementById("batch-output");

  batchOutputEl.textContent = "";

  if (!Number.isFinite(trials) || trials <= 0) {
    outputEl.textContent = "Enter a valid trial count.";
    return;
  }

  if (!Number.isFinite(hp) || hp < 0 || hp > 1) {
    outputEl.textContent = "Enter HP as a decimal between 0 and 1.";
    return;
  }

  const strategy = getSelectedStrategy();
  const probability = runSim(trials, hp, strategy.numScythes, strategy.numClaws, strategy.numShadows);

  outputEl.textContent =
    `Success rate at ${(hp * 100).toFixed(0)}% HP (${strategy.name}): ${(probability * 100).toFixed(2)}%`;
}

function runBatch() {
  const trials = Number(document.getElementById("trials").value);
  const outputEl = document.getElementById("output");
  const batchOutputEl = document.getElementById("batch-output");

  outputEl.textContent = "";

  if (!Number.isFinite(trials) || trials <= 0) {
    batchOutputEl.textContent = "Enter a valid trial count.";
    return;
  }

  const strategy = getSelectedStrategy();
  const results = runBatchSim(trials, strategy.numScythes, strategy.numClaws, strategy.numShadows);
  renderBatchChart(results, strategy.name);

  let output = `\tStrategy: ${strategy.name}\n\tVerzik HP | Skip success rate\n`;
  for (const { hp, probability } of results) {
    output += `\t${hp}%\t\t${(probability * 100).toFixed(2)}%\n`;
  }

  batchOutputEl.textContent = output;
}

document.getElementById("run-single").addEventListener("click", runSingle);
document.getElementById("run-batch").addEventListener("click", runBatch);