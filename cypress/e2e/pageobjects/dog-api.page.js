class DogApiPage {
  listAllBreeds() {
    return cy.request({
      method: "GET",
      url: "/breeds/list/all"
    });
  }

  listBreedImages(breed, options = {}) {
    return cy.request({
      method: "GET",
      url: `/breed/${breed}/images`,
      failOnStatusCode: true,
      ...options
    });
  }

  getRandomImage() {
    return cy.request({
      method: "GET",
      url: "/breeds/image/random"
    });
  }
}

module.exports = {
  dogApiPage: new DogApiPage()
};