import { runSim, runBatchSim } from "./simulation.js";

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

  const probability = runSim(trials, hp);

  outputEl.textContent =
    `Success rate at ${(hp * 100).toFixed(0)}% HP: ${(probability * 100).toFixed(2)}%`;
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

  const results = runBatchSim(trials);

  let output = "\tVerzik HP | Skip success rate\n";
  for (const { hp, probability } of results) {
    output += `\t${hp}%\t\t${(probability * 100).toFixed(2)}%\n`;
  }

  batchOutputEl.textContent = output;
}

document.getElementById("run-single").addEventListener("click", runSingle);
document.getElementById("run-batch").addEventListener("click", runBatch);