import { isAuthenticated } from "../../../config";
import { prisma } from "../../../../generated/prisma-client";
import { fnLog } from "../../../utils";

export default {
  Mutation: {
    toggleLike: async (_, args, { request }) => {
      isAuthenticated(request);
      const { feedId } = args;
      const { user } = request;

fnLog(`feedId : ${feedId}`);

      const filterOptions = {
        AND: [
          {
            user: {
              id: user.id
            }
          },
          {
            feed: {
              id: feedId
            }
          }
        ]
      };
      try {
        const existingLike = await prisma.$exists.like(filterOptions);

fnLog(`existingLike : ${existingLike}`);

        if (existingLike) {
          await prisma.deleteManyLikes(filterOptions);
        } else {
          await prisma.createLike({
            user: {
              connect: {
                id: user.id
              }
            },
            feed: {
              connect: {
                id: feedId
              }
            }
          });
        }
        return true;
      } catch {
        return false;
      }
    }
  }
};