const { Given, When, Then } = require("@badeball/cypress-cucumber-preprocessor");
const { dogApiPage } = require("../pageobjects/dog-api.page");
const breedsListAllSchema = require("../../fixtures/schemas/breeds-list-all.schema.json");
const breedImagesSchema = require("../../fixtures/schemas/breed-images.schema.json");
const randomImageSchema = require("../../fixtures/schemas/random-image.schema.json");
const breedNotFoundSchema = require("../../fixtures/schemas/breed-not-found.schema.json");

const responseAlias = "apiResponse";
const breedAlias = "selectedBreed";

Given("que a Dog API esta configurada para testes", () => {
  expect(Cypress.config("baseUrl")).to.be.a("string").and.not.to.be.empty;
});

When("eu consultar a lista completa de racas", () => {
  dogApiPage.listAllBreeds().as(responseAlias);
});

When("eu consultar as imagens da raca {string}", (breed) => {
  cy.wrap(breed, { log: false }).as(breedAlias);
  dogApiPage.listBreedImages(breed).as(responseAlias);
});

When("eu consultar as imagens da raca invalida {string}", (breed) => {
  cy.wrap(breed, { log: false }).as(breedAlias);
  dogApiPage.listBreedImages(breed, { failOnStatusCode: false }).as(responseAlias);
});

When("eu consultar uma imagem aleatoria de cachorro", () => {
  dogApiPage.getRandomImage().as(responseAlias);
});

Then("a API deve responder com status HTTP {int}", (statusCode) => {
  cy.get(`@${responseAlias}`).its("status").should("equal", statusCode);
});

Then("o status de negocio deve ser {string}", (status) => {
  cy.get(`@${responseAlias}`).its("body.status").should("equal", status);
});

Then("o contrato da lista de racas deve ser valido", () => {
  cy.get(`@${responseAlias}`).then((response) => {
    cy.validateSchema(breedsListAllSchema, response.body);
  });
});

Then("o contrato de imagens por raca deve ser valido", () => {
  cy.get(`@${responseAlias}`).then((response) => {
    cy.validateSchema(breedImagesSchema, response.body);
  });
});

Then("o contrato de imagem aleatoria deve ser valido", () => {
  cy.get(`@${responseAlias}`).then((response) => {
    cy.validateSchema(randomImageSchema, response.body);
  });
});

Then("o contrato de erro de raca inexistente deve ser valido", () => {
  cy.get(`@${responseAlias}`).then((response) => {
    cy.validateSchema(breedNotFoundSchema, response.body);
  });
});

Then("a resposta deve conter a raca {string}", (breed) => {
  cy.get(`@${responseAlias}`).its("body.message").should("have.property", breed);
});

Then("a lista de imagens deve conter URLs relacionadas a raca consultada", () => {
  cy.get(`@${breedAlias}`).then((breed) => {
    cy.get(`@${responseAlias}`).then((response) => {
      expect(response.body.message).to.be.an("array").and.not.to.be.empty;

      const allUrlsContainBreedReference = response.body.message.every((url) => {
        return url.includes(`/${breed}/`) || url.includes(`-${breed}-`) || url.includes(breed);
      });

      expect(allUrlsContainBreedReference).to.equal(true);
    });
  });
});