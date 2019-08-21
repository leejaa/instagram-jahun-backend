import { prisma } from "../../../../generated/prisma-client";

 export default {
  Mutation: {
    upload: async (_, args, { request, isAuthenticated }) => {
      isAuthenticated(request);
      const { user } = request;
      const { title, content, files } = args;
      const feed = await prisma.createFeed({
        title,
        content,
        user: { connect: { id: user.id } }
      });
      files.forEach(
        async file =>
          await prisma.createPicture({
            url: file,
            feed: {
              connect: {
                id: feed.id
              }
            },
            user: {
                connect: {
                    id: user.id
                }
            }
          })
      );
      return feed;
    }
  }
};