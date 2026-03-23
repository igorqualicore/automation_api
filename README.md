# Automacao API - Dog CEO

Projeto de automacao de testes da Dog API desenvolvido em JavaScript com Cypress, Gherkin e foco em boas praticas, organizacao, legibilidade e facilidade de execucao em ambiente local e CI.

## Objetivo

Validar os principais endpoints da Dog API:

- GET /breeds/list/all
- GET /breed/{breed}/images
- GET /breeds/image/random

O projeto cobre cenarios positivos e negativos, validacao de contrato, relatorio em HTML e execucao automatizada em pipeline.

## Stack utilizada

- Node.js
- Cypress
- Cucumber preprocessor com Gherkin
- Ajv para validacao de schema
- multiple-cucumber-html-reporter para relatorio
- GitHub Actions para CI

## Estrutura do projeto

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
|   `-- run-tests.js
|-- .nvmrc
|-- cypress.config.js
|-- package.json
`-- README.md
```

## Padrao adotado

Embora page object seja um padrao mais comum para UI, aqui ele foi adaptado para API por meio de uma camada de objetos de endpoint dentro do proprio Cypress. Isso ajuda a centralizar chamadas HTTP e separar responsabilidades entre:

- e2e/feature: arquivos .feature
- e2e/step: step definitions
- e2e/pageobjects: camada de acesso aos endpoints
- support/commands.js: comandos customizados reutilizaveis do Cypress
- fixtures/schemas: contratos esperados de resposta

## Pre-requisitos

- Node.js 20 ou superior
- npm 10 ou superior

## Instalacao

```bash
npm install
```

## Execucao dos testes

Para executar toda a suite:

```bash
npm test
```

Esse comando:

- executa os testes no Cypress em modo headless
- gera arquivos JSON de resultados por feature
- gera o relatorio HTML consolidado em reports/html

Se quiser executar apenas o Cypress em modo headless:

```bash
npm run test:api
```

Se quiser abrir o Cypress de forma interativa:

```bash
npm run cy:open
```

Se utilizar nvm, a versao sugerida esta definida em .nvmrc:

```bash
nvm use
```

Se quiser regenerar o relatorio HTML a partir do JSON:

```bash
npm run report
```

## Variaveis de ambiente opcionais

O projeto aceita configuracao por variaveis de ambiente:

- DOG_API_BASE_URL: URL base da API
- DOG_API_TIMEOUT: timeout das requisicoes em milissegundos

Exemplo no terminal:

```bash
DOG_API_BASE_URL=https://dog.ceo/api
DOG_API_TIMEOUT=15000
```

## Cenarios automatizados

- Listagem completa de racas com validacao de contrato
- Consulta de imagens por raca valida
- Consulta de imagem aleatoria
- Consulta de raca inexistente com validacao de erro

## Relatorio de resultados

Ao final da execucao, o relatorio fica disponivel em:

- reports/cucumber-json/
- reports/html/index.html

O relatorio HTML apresenta:

- testes com sucesso e falha
- detalhes de erro
- duracao de execucao
- consolidacao por feature e scenario

## Pipeline CI

O projeto possui pipeline no GitHub Actions em .github/workflows/api-tests.yml com as etapas:

- execucao automatica em push para a branch main
- execucao automatica diaria as 8:00 no horario de Brasilia
- execucao manual via workflow_dispatch
- checkout do codigo
- instalacao do Node.js
- instalacao das dependencias
- execucao dos testes
- publicacao do artefato do relatorio HTML da execucao
- publicacao do artefato JSON bruto da execucao

Observacao sobre agendamento:

- o GitHub Actions usa UTC no cron
- 8:00 de Brasilia corresponde a 11:00 UTC

## Boas praticas aplicadas

- Separacao clara de responsabilidades
- Configuracao centralizada por ambiente no Cypress
- Validacao de contrato com schema
- Cenarios Gherkin legiveis
- Separacao explicita entre feature, steps e pageobjects
- Camada de acesso aos endpoints para evitar duplicacao de requisicoes
- Comandos customizados para assercoes reutilizaveis
- Estrutura aderente ao padrao de pastas do Cypress
- Relatorio HTML para analise da execucao
- Estrutura preparada para evolucao da suite

## Observacoes

- A Dog API e um servico publico, portanto indisponibilidades externas podem impactar a execucao.
- O endpoint de raca invalida foi mantido para ampliar a cobertura com um cenario negativo relevante.