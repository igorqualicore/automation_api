const fs = require("node:fs");
const path = require("node:path");

const projectRoot = path.resolve(__dirname, "..");
const reportJsonDirectory = path.join(projectRoot, "reports", "cucumber-json");
const reportDirectory = path.join(projectRoot, "reports", "html");
const reportFile = path.join(reportDirectory, "index.html");

function getJsonFiles(directoryPath) {
  if (!fs.existsSync(directoryPath)) {
    return [];
  }

  return fs.readdirSync(directoryPath)
    .filter((fileName) => fileName.endsWith(".json"))
    .map((fileName) => path.join(directoryPath, fileName));
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function formatDuration(durationInNanoseconds) {
  const durationInMilliseconds = Number(durationInNanoseconds || 0) / 1000000;

  if (durationInMilliseconds < 1000) {
    return `${durationInMilliseconds.toFixed(0)} ms`;
  }

  return `${(durationInMilliseconds / 1000).toFixed(2)} s`;
}

function getEnvironmentFromFile(filePath) {
  const fileName = path.basename(filePath, ".json");
  const prefix = "cucumber-report-";

  if (fileName.startsWith(prefix)) {
    return fileName.slice(prefix.length);
  }

  if (fileName === "cucumber-report") {
    return "local";
  }

  return fileName;
}

function collectResults(jsonFiles) {
  const scenarios = [];

  for (const filePath of jsonFiles) {
    const environment = getEnvironmentFromFile(filePath);
    const features = JSON.parse(fs.readFileSync(filePath, "utf-8"));

    for (const feature of features) {
      for (const element of feature.elements || []) {
        if (element.type !== "scenario") {
          continue;
        }

        const statuses = (element.steps || []).map((step) => step.result?.status || "unknown");
        const scenarioStatus = statuses.includes("failed")
          ? "failed"
          : statuses.includes("skipped")
            ? "skipped"
            : statuses.includes("pending")
              ? "pending"
              : "passed";

        const duration = (element.steps || []).reduce(
          (total, step) => total + Number(step.result?.duration || 0),
          0
        );

        scenarios.push({
          environment,
          featureName: feature.name || "Feature",
          scenarioName: element.name || "Scenario",
          status: scenarioStatus,
          duration,
          steps: element.steps || []
        });
      }
    }
  }

  return scenarios;
}

function buildHtmlReport(scenarios) {
  const total = scenarios.length;
  const passed = scenarios.filter((scenario) => scenario.status === "passed").length;
  const failed = scenarios.filter((scenario) => scenario.status === "failed").length;
  const pending = scenarios.filter((scenario) => scenario.status === "pending").length;
  const skipped = scenarios.filter((scenario) => scenario.status === "skipped").length;
  const environments = [...new Set(scenarios.map((scenario) => scenario.environment))];

  const rows = scenarios.map((scenario) => {
    const stepItems = scenario.steps.map((step) => {
      const status = step.result?.status || "unknown";
      return `<li><span class="step-status ${escapeHtml(status)}">${escapeHtml(status)}</span><span>${escapeHtml(step.keyword)}${escapeHtml(step.name)}</span></li>`;
    }).join("");

    return `
      <tr>
        <td>${escapeHtml(scenario.environment)}</td>
        <td>${escapeHtml(scenario.featureName)}</td>
        <td>${escapeHtml(scenario.scenarioName)}</td>
        <td><span class="status ${escapeHtml(scenario.status)}">${escapeHtml(scenario.status)}</span></td>
        <td>${escapeHtml(formatDuration(scenario.duration))}</td>
        <td><details><summary>Ver passos</summary><ul class="steps">${stepItems}</ul></details></td>
      </tr>
    `;
  }).join("");

  const generatedAt = new Date().toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" });

  return `<!DOCTYPE html>
<html lang="pt-BR">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Dog API | Relatorio Consolidado</title>
    <style>
      :root {
        --bg: #f3f6f8;
        --panel: #ffffff;
        --text: #16212b;
        --muted: #5f6f7c;
        --border: #d7e1e8;
        --pass: #18794e;
        --fail: #c4382b;
        --pending: #a86500;
        --skip: #5c6670;
        --accent: #0b5fff;
      }
      * { box-sizing: border-box; }
      body {
        margin: 0;
        font-family: "Segoe UI", "IBM Plex Sans", sans-serif;
        background: linear-gradient(180deg, #edf4f8 0%, #f7fafc 100%);
        color: var(--text);
      }
      .container {
        width: min(1180px, calc(100% - 32px));
        margin: 32px auto 48px;
      }
      .hero, .panel {
        background: var(--panel);
        border: 1px solid var(--border);
        border-radius: 18px;
        box-shadow: 0 12px 32px rgba(22, 33, 43, 0.06);
      }
      .hero {
        padding: 28px;
        margin-bottom: 20px;
      }
      h1 {
        margin: 0 0 8px;
        font-size: 28px;
      }
      .subtitle {
        margin: 0;
        color: var(--muted);
      }
      .meta, .summary {
        display: grid;
        gap: 14px;
        grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
        margin-top: 22px;
      }
      .card {
        border: 1px solid var(--border);
        border-radius: 14px;
        padding: 16px;
        background: #fbfdff;
      }
      .card strong {
        display: block;
        font-size: 24px;
        margin-top: 6px;
      }
      .label {
        color: var(--muted);
        font-size: 12px;
        text-transform: uppercase;
        letter-spacing: 0.08em;
      }
      .panel {
        padding: 22px;
      }
      table {
        width: 100%;
        border-collapse: collapse;
        margin-top: 10px;
      }
      th, td {
        padding: 14px 12px;
        border-bottom: 1px solid var(--border);
        text-align: left;
        vertical-align: top;
      }
      th {
        color: var(--muted);
        font-size: 12px;
        text-transform: uppercase;
        letter-spacing: 0.06em;
      }
      .status, .step-status {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        border-radius: 999px;
        padding: 4px 10px;
        font-size: 12px;
        font-weight: 600;
        text-transform: uppercase;
      }
      .passed { background: rgba(24, 121, 78, 0.12); color: var(--pass); }
      .failed { background: rgba(196, 56, 43, 0.12); color: var(--fail); }
      .pending { background: rgba(168, 101, 0, 0.12); color: var(--pending); }
      .skipped { background: rgba(92, 102, 112, 0.12); color: var(--skip); }
      .steps {
        margin: 10px 0 0;
        padding-left: 0;
        list-style: none;
        display: grid;
        gap: 8px;
      }
      .steps li {
        display: flex;
        gap: 10px;
        align-items: flex-start;
      }
      summary {
        cursor: pointer;
        color: var(--accent);
        font-weight: 600;
      }
      @media (max-width: 760px) {
        table, thead, tbody, th, td, tr {
          display: block;
        }
        thead {
          display: none;
        }
        tr {
          border: 1px solid var(--border);
          border-radius: 14px;
          padding: 8px;
          margin-bottom: 12px;
        }
        td {
          border-bottom: none;
          padding: 8px;
        }
      }
    </style>
  </head>
  <body>
    <main class="container">
      <section class="hero">
        <h1>Dog API | Relatorio Consolidado</h1>
        <p class="subtitle">Execucao consolidada dos testes de API em Linux, Windows e macOS.</p>
        <div class="meta">
          <div class="card"><span class="label">Projeto</span><strong>automation_api</strong></div>
          <div class="card"><span class="label">Runner</span><strong>Cypress</strong></div>
          <div class="card"><span class="label">Base URL</span><strong>${escapeHtml(process.env.DOG_API_BASE_URL || "https://dog.ceo/api")}</strong></div>
          <div class="card"><span class="label">Gerado em</span><strong>${escapeHtml(generatedAt)}</strong></div>
        </div>
        <div class="summary">
          <div class="card"><span class="label">Total de cenarios</span><strong>${total}</strong></div>
          <div class="card"><span class="label">Aprovados</span><strong>${passed}</strong></div>
          <div class="card"><span class="label">Falhos</span><strong>${failed}</strong></div>
          <div class="card"><span class="label">Pendentes</span><strong>${pending + skipped}</strong></div>
        </div>
        <div class="meta">
          <div class="card"><span class="label">Ambientes validados</span><strong>${escapeHtml(environments.join(" | ") || "local")}</strong></div>
          <div class="card"><span class="label">Escopo</span><strong>Endpoints principais + cenario negativo</strong></div>
        </div>
      </section>
      <section class="panel">
        <h2>Resultados detalhados</h2>
        <table>
          <thead>
            <tr>
              <th>Ambiente</th>
              <th>Feature</th>
              <th>Cenario</th>
              <th>Status</th>
              <th>Duracao</th>
              <th>Passos</th>
            </tr>
          </thead>
          <tbody>
            ${rows}
          </tbody>
        </table>
      </section>
    </main>
  </body>
</html>`;
}

const jsonFiles = getJsonFiles(reportJsonDirectory);

if (jsonFiles.length === 0) {
  console.warn("Diretorio de resultados do Cucumber nao encontrado. Relatorio HTML nao foi gerado.");
  process.exit(0);
}

const scenarios = collectResults(jsonFiles);
fs.mkdirSync(reportDirectory, { recursive: true });
fs.writeFileSync(reportFile, buildHtmlReport(scenarios), "utf-8");