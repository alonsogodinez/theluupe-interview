const { rule, shield } = require('graphql-shield');

const r = {
  isAnybody: rule({ cache: 'contextual' })(() => true),
  isAuthenticated: rule()(async (parent, args, ctx) => {
    return !!ctx.token;
  })
};

const permissions = {
  Query: {
    user: r.isAnybody,
    users: r.isAuthenticated,
    posts: r.isAuthenticated,
  },
  Mutation: {
    createOneUser: r.isAnybody,
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
