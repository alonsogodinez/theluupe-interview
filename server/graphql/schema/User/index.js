const { objectType } = require('nexus');

const { fullName, totalPosts } = require('./resolvers');

const User = objectType({
  name: 'User',
  definition(t) {
    t.model.id();
    t.model.email();
    t.model.firstName();
    t.model.lastName();
    t.model.password();
    t.nonNull.list.nonNull.field('posts', {
      type: 'Post',
      resolve: (parent, _, context) => {
        return context.prisma.user
          .findUnique({
            where: { id: parent.id || undefined },
          })
          .posts()
      },
    })
    t.string('fullName', { resolve: fullName });
    t.int('totalPosts', { resolve: totalPosts });
  },
});

const AuthPayload = objectType({
  name: "AuthPayload",
  definition(t) {
    t.field("user", {
      type: "User",
      nullable: false,
    });
    t.string('token')
  },
});

const MyUser = objectType({
  name: "MyUser",
  definition(t) {
    t.string('id')
    t.string('firstName')
  },
});


module.exports = {
  User,
  AuthPayload,
  MyUser
};
