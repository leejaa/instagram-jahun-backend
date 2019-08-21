import { prisma } from "../../../generated/prisma-client";

export default {
  Feed: {
    user: ({id}) => prisma.feed({id}).user()
    , likes: ({id}) => prisma.feed({id}).likes()
    , pictures: ({id}) => prisma.feed({id}).pictures()
    , comments: ({id}) => prisma.feed({id}).comments()
    , isLiked: (parent, _, { request }) => {
        const { user } = request;
        const { id } = parent;

        // console.log(`user : ${JSON.stringify(user, null, 2)}`);
        console.log(`id : ${id}`);

        return prisma.$exists.like({
          AND: [
            {
              user: {
                id: user.id
              }
            },
            {
              feed: {
                id
              }
            }
          ]
        });
      }
    , likeCount: ({id}) =>
      prisma
        .likesConnection({
          where: { feed: { id } }
        })
        .aggregate()
        .count()
  },
  Comment: {
    user: ({id}) => prisma.comment({id}).user()
  }
};