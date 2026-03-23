const fs = require("node:fs");
const path = require("node:path");

const suffix = process.argv[2];

if (!suffix) {
  console.error("Informe o sufixo do sistema operacional para renomear o JSON do relatorio.");
  process.exit(1);
}

const reportsDirectory = path.resolve(__dirname, "..", "reports", "cucumber-json");
const originalFile = path.join(reportsDirectory, "cucumber-report.json");
const renamedFile = path.join(reportsDirectory, `cucumber-report-${suffix}.json`);

if (!fs.existsSync(originalFile)) {
  console.warn("Arquivo cucumber-report.json nao encontrado. Nenhuma renomeacao foi realizada.");
  process.exit(0);
}

if (fs.existsSync(renamedFile)) {
  fs.rmSync(renamedFile, { force: true });
}

fs.renameSync(originalFile, renamedFile);