const { rule, shield, and } = require('graphql-shield');

const r = {
  isAnybody: rule({ cache: 'contextual' })(() => true),
  isPostAuthor: rule()(async (_parent, { authorId , where }, { prisma, token }) => {
    if(authorId) {
      return authorId === token.userId;
    } else {

      const post = await prisma.post.findUnique({ where});
      return post == null || post.authorId === token.userId;
    }
  }),
  isSameUser: rule({ cache: 'contextual' })(async (_parent, { where }, ctx) => {
    const id = where && where.id
    const user = await ctx.prisma.user.findUnique({ where: { id } });
    if (!ctx || !user) {
      return false;
    }
    return ctx.token.userId === user.id;
  }),

  isValidAuthor: rule()(async (_parent, { data }, { token }) => {
    return token.userId === data.author.connect.id
  }),
  isAuthenticated: rule()(async (parent, args, ctx) => {
    return !!ctx.token;
  })
};

const permissions = {
  Query: {
    myUser: r.isAuthenticated,
    user: r.isAnybody,
    users: r.isAuthenticated,
    posts: r.isAnybody,
    userPosts: r.isAuthenticated,
  },
  Mutation: {
    createOneUser: r.isAnybody,
    updateOneUser: r.isSameUser,
    createOnePost: and(r.isAuthenticated, r.isValidAuthor),
    updateOnePost: and(r.isAuthenticated, r.isPostAuthor),
    deleteOnePost: and(r.isAuthenticated, r.isPostAuthor)
  },
  User: r.isAnybody,
};

const permissionsMiddleware = shield(permissions, {
  fallbackRule: r.isAnybody,
  // graphql-shield catches all resolver errors by default
  // This allows us to get some diagnostic data in all environments
  allowExternalErrors: true,
});

module.exports = {
  permissionsMiddleware,
};
