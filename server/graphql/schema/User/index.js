const { objectType } = require('nexus');

const { fullName, totalPosts } = require('./resolvers');

const User = objectType({
  name: 'User',
  definition(t) {
    t.model.id();
    t.model.email();
    t.model.firstName();
    t.model.lastName();
    t.model.posts();
    t.string('fullName', { resolve: fullName });
    t.int('totalPosts', { resolve: totalPosts });
  },
});

module.exports = {
  User,
};
