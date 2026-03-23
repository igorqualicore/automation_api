const Ajv = require("ajv");

const ajv = new Ajv({ allErrors: true });

Cypress.Commands.add("validateSchema", (schema, payload) => {
  const validate = ajv.compile(schema);
  const valid = validate(payload);

  expect(valid, JSON.stringify(validate.errors || [])).to.equal(true);
});