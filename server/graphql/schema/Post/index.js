const { objectType } = require('nexus');

const Post = objectType({
  name: 'Post',
  definition(t) {
    t.model.id();
    t.model.title();
    t.model.author();
    t.model.content();
  },
});

module.exports = {
  Post,
};
