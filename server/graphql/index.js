const { nexusPrisma } = require('nexus-plugin-prisma');
const { makeSchema, declarativeWrappingPlugin } = require('nexus');
const prisma = require('../lib/prisma');
const types = require('./schema');
const { getToken } = require('../utils')

const schema = makeSchema({
  types,
  plugins: [declarativeWrappingPlugin(), nexusPrisma({ experimentalCRUD: true, paginationStrategy: 'prisma' })],
  outputs: {
    schema: `${__dirname}/generated/schema.graphql`,
    typegen: `${__dirname}/generated/nexus.ts`,
  },
});

const context = req => {
  return {
    ...req,
    prisma,
    token: getToken(req)
  };
};

module.exports = {
  schema,
  context,
};
