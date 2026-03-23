const fs = require("node:fs");
const path = require("node:path");
const { spawnSync } = require("node:child_process");

const reportsDirectory = path.resolve(__dirname, "..", "reports");
const reportJsonDirectory = path.resolve(reportsDirectory, "cucumber-json");
const cypressCommand = process.platform === "win32" ? "npx.cmd" : "npx";

function runCommand(command, args, useShell = process.platform === "win32") {
  return spawnSync(command, args, {
    stdio: "inherit",
    shell: useShell
  });
}

fs.rmSync(reportsDirectory, { recursive: true, force: true });
fs.mkdirSync(reportJsonDirectory, { recursive: true });

const testExecution = runCommand(cypressCommand, ["cypress", "run", "--config-file", "cypress.config.js"], process.platform === "win32");

if (testExecution.error) {
  console.error("Falha ao iniciar o Cypress:", testExecution.error.message);
  process.exit(1);
}

const reportScript = path.resolve(__dirname, "generate-report.js");

if (fs.existsSync(reportJsonDirectory)) {
  const reportExecution = runCommand(process.execPath, [reportScript], false);

  if (reportExecution.status !== 0) {
    process.exit(reportExecution.status ?? 1);
  }
}

process.exit(testExecution.status ?? 1);