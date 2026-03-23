Feature: Validar endpoints principais da Dog API
  Como QA da aplicacao para amantes de caes
  Eu quero validar os endpoints principais da Dog API
  Para garantir que a integracao entregue dados corretos e confiaveis

  Background:
    Given que a Dog API esta configurada para testes

  Scenario: Listar todas as racas disponiveis
    When eu consultar a lista completa de racas
    Then a API deve responder com status HTTP 200
    And o status de negocio deve ser "success"
    And o contrato da lista de racas deve ser valido
    And a resposta deve conter a raca "hound"

  Scenario: Listar imagens de uma raca valida
    When eu consultar as imagens da raca "hound"
    Then a API deve responder com status HTTP 200
    And o status de negocio deve ser "success"
    And o contrato de imagens por raca deve ser valido
    And a lista de imagens deve conter URLs relacionadas a raca consultada

  Scenario: Obter uma imagem aleatoria
    When eu consultar uma imagem aleatoria de cachorro
    Then a API deve responder com status HTTP 200
    And o status de negocio deve ser "success"
    And o contrato de imagem aleatoria deve ser valido

  Scenario: Consultar imagens de uma raca inexistente
    When eu consultar as imagens da raca invalida "raca-inexistente"
    Then a API deve responder com status HTTP 404
    And o status de negocio deve ser "error"
    And o contrato de erro de raca inexistente deve ser valido