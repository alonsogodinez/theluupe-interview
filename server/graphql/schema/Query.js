const { queryType, stringArg } = require('nexus');

const Query = queryType({
  definition(t) {
    t.crud.user({ filtering: true });
    t.crud.users({ ordering: true, filtering: true });
    t.crud.posts({ filtering: true });
    t.crud.posts({ ordering: true, filtering: true });
    t.field('myUser', {
      type: 'MyUser',
      resolve: (parent, { name }, ctx) => {
        if(ctx.token) {
          return {
            id: ctx.token.userId,
            firstName: ctx.token.firstName
          }
        } else {
          return null
        }
      },
    })
    t.list.field('userPosts', {
      type: 'Post',
      args: {
        authorId: stringArg({ nullable: false }),
      },
      resolve(_root, args, context) {
        return context.prisma.post.findMany({ where: { authorId: { equals: args.authorId } } });
      },
    });
  }
});

module.exports = {
  Query,
};
