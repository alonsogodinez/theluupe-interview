const { mutationType} = require('nexus');
const Mutation = mutationType({
  definition(t) {
    t.crud.createOneUser();
    t.crud.createOnePost();
    t.crud.deleteOnePost();
    t.crud.updateOnePost();
    t.crud.updateOneUser();
  },
});

module.exports = {
  Mutation,
};
