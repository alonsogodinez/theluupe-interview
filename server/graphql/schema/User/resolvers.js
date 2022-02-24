function fullName(parent) {
  const { firstName, lastName } = parent;
  if (firstName || lastName) {
    return `${firstName} ${lastName}`.trim();
  }
  return null;
}

function totalPosts(parent, args, ctx) {
  return ctx.prisma.post.count({ where: { authorId: parent.id } });
}

module.exports = {
  fullName,
  totalPosts,
};
