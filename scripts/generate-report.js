const fs = require("node:fs");
const path = require("node:path");
const reporter = require("multiple-cucumber-html-reporter");

const projectRoot = path.resolve(__dirname, "..");
const reportJsonDirectory = path.join(projectRoot, "reports", "cucumber-json");
const reportDirectory = path.join(projectRoot, "reports", "html");

function hasJsonReports(directoryPath) {
  if (!fs.existsSync(directoryPath)) {
    return false;
  }

  return fs.readdirSync(directoryPath).some((fileName) => fileName.endsWith(".json"));
}

if (!hasJsonReports(reportJsonDirectory)) {
  console.warn("Diretorio de resultados do Cucumber nao encontrado. Relatorio HTML nao foi gerado.");
  process.exit(0);
}

reporter.generate({
  jsonDir: reportJsonDirectory,
  reportPath: reportDirectory,
  pageTitle: "Dog API | Relatorio Consolidado",
  reportName: "Dog API | Execucao Consolidada de API Tests",
  displayDuration: true,
  displayReportTime: true,
  pageFooter: "Relatorio consolidado automaticamente a partir das execucoes em Linux, Windows e macOS.",
  metadata: {
    browser: {
      name: "Cypress API Tests",
      version: "N/A"
    },
    device: "CI",
    platform: {
      name: "Multi-OS",
      version: "ubuntu-latest | windows-latest | macos-latest"
    }
  },
  customData: {
    title: "Resumo da Execucao",
    data: [
      { label: "Projeto", value: "automation_api" },
      { label: "Base URL", value: process.env.DOG_API_BASE_URL || "https://dog.ceo/api" },
      { label: "Node", value: process.version },
      { label: "Runner", value: "Cypress" },
      { label: "Escopo", value: "Dog API - endpoints principais e cenario negativo" },
      { label: "Ambientes", value: "Linux, Windows e macOS" }
    ]
  }
});