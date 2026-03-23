# Automacao API - Dog CEO

Projeto de automacao de testes de API desenvolvido como entrega de teste tecnico para vaga de QA Pleno, com foco em organizacao, boas praticas, legibilidade, portabilidade e evidencias claras de execucao.

## Resumo Executivo

Esta solucao valida os principais endpoints publicos da Dog API por meio de testes automatizados escritos em JavaScript com Cypress e Gherkin.

Os principais objetivos da entrega foram:

- garantir cobertura dos endpoints solicitados
- estruturar o projeto de forma limpa e escalavel
- disponibilizar execucao simples em ambiente local
- gerar relatorio HTML claro para analise da execucao
- automatizar a validacao em pipeline multi-plataforma

## Escopo Validado

Endpoints cobertos:

- GET /breeds/list/all
- GET /breed/{breed}/images
- GET /breeds/image/random

Cobertura implementada:

- cenario positivo para listagem completa de racas
- cenario positivo para consulta de imagens por raca valida
- cenario positivo para imagem aleatoria
- cenario negativo para raca inexistente
- validacao de contrato das respostas com schema

## Tecnologias Utilizadas

- Node.js 24+
- Cypress
- Cucumber preprocessor com Gherkin
- Ajv para validacao de schema
- gerador HTML customizado para consolidacao de resultados
- GitHub Actions

## Diferenciais Tecnicos

- estrutura organizada por feature, steps e pageobjects
- separacao clara entre dados, fluxo de teste e camada de acesso aos endpoints
- validacao de contrato com schemas dedicados
- execucao local simples via npm
- pipeline com execucao em Linux, Windows e macOS
- agendamento diario e execucao automatica em push para main
- geracao de um unico relatorio HTML consolidado ao final da pipeline

## Estrutura do Projeto

```text
.
|-- .github/
|   `-- workflows/
|       `-- api-tests.yml
|-- cypress/
|   |-- e2e/
|   |   |-- feature/
|   |   |   `-- dog-api.feature
|   |   |-- pageobjects/
|   |   |   `-- dog-api.page.js
|   |   `-- step/
|   |       `-- dog-api.steps.js
|   |-- fixtures/
|   |   `-- schemas/
|   |       |-- breed-images.schema.json
|   |       |-- breed-not-found.schema.json
|   |       |-- breeds-list-all.schema.json
|   |       `-- random-image.schema.json
|   `-- support/
|       |-- commands.js
|       `-- e2e.js
|-- scripts/
|   |-- generate-report.js
|   |-- rename-report-json.js
|   `-- run-tests.js
|-- .nvmrc
|-- cypress.config.js
|-- package.json
`-- README.md
```

## Padrao de Organizacao

O projeto segue uma estrutura simples e objetiva para facilitar manutencao e leitura:

- e2e/feature: cenarios em Gherkin
- e2e/step: implementacao das regras e assercoes
- e2e/pageobjects: encapsulamento das chamadas aos endpoints
- fixtures/schemas: contratos esperados das respostas
- support: comandos e configuracoes compartilhadas
- scripts: automacao de execucao local e geracao de relatorio

Embora o termo page object seja mais comum em UI, aqui ele foi adaptado como camada de acesso aos endpoints para evitar duplicacao e centralizar a interacao com a API.

## Pre-requisitos

- Node.js 24 ou superior
- npm 10 ou superior

Se utilizar nvm:

```bash
nvm use
```

## Instalacao

```bash
npm install
```

## Como Executar

Executar toda a suite com relatorio:

```bash
npm test
```

Executar apenas o runner do Cypress:

```bash
npm run test:api
```

Abrir o Cypress de forma interativa:

```bash
npm run cy:open
```

Regenerar o relatorio HTML a partir dos arquivos JSON:

```bash
npm run report
```

## Configuracao Opcional

O projeto aceita configuracao por variaveis de ambiente:

- DOG_API_BASE_URL: URL base da API
- DOG_API_TIMEOUT: timeout das requisicoes em milissegundos

Exemplo:

```bash
DOG_API_BASE_URL=https://dog.ceo/api
DOG_API_TIMEOUT=15000
```

Na ausencia dessas variaveis, o projeto utiliza valores padrao seguros para execucao local.

## Relatorio de Execucao

Ao final da execucao local, os artefatos ficam disponiveis em:

- reports/cucumber-json/
- reports/html/index.html

O relatorio HTML foi configurado para ser mais objetivo e facilitar a avaliacao, apresentando:

- status final da execucao
- cenarios aprovados e falhos
- detalhes de erro quando existirem
- duracao da execucao
- consolidacao por feature e scenario
- contexto do escopo validado
- ambiente em que cada execucao foi realizada

## Pipeline CI

O projeto possui pipeline no GitHub Actions em [.github/workflows/api-tests.yml](.github/workflows/api-tests.yml) com os seguintes comportamentos:

- execucao automatica em push para a branch main
- execucao automatica diaria as 8:00 no horario de Brasilia
- execucao manual via workflow_dispatch
- execucao em matriz para Linux, Windows e macOS
- uso de Node.js 24.x
- runtime das GitHub Actions forçado para Node 24

Fluxo da pipeline:

- cada sistema operacional executa a suite de testes
- cada execucao publica o JSON bruto de resultado
- um job final consolida os resultados
- a pipeline publica um unico relatorio HTML final por execucao

Observacao sobre agendamento:

- o GitHub Actions usa UTC no cron
- 8:00 de Brasilia corresponde a 11:00 UTC

## Evidencias da Entrega

Esta entrega contempla:

- automacao dos endpoints solicitados
- cenarios positivos e negativos
- validacao de contrato
- relatorio HTML
- pipeline multi-OS
- documentacao de execucao local e em CI

## Consideracoes Finais

- a Dog API e um servico publico, portanto indisponibilidades externas podem impactar a execucao
- o cenario negativo de raca inexistente foi incluido para ampliar a cobertura e demonstrar tratamento de erro
- a estrutura foi organizada com foco em manutencao, clareza e reaproveitamento