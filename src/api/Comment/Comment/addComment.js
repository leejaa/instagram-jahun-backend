import { isAuthenticated } from "../../../config";
import { prisma } from "../../../../generated/prisma-client";
import { fnLog } from "../../../utils";

 export default {
  Mutation: {
    addComment: async (_, args, { request }) => {
      isAuthenticated(request);
      const { text, feedId } = args;

fnLog(`feedId : ${feedId} / text : ${text}`);

      const { user } = request;
      const comment = await prisma.createComment({
        user: {
          connect: {
            id: user.id
          }
        },
        feed: {
          connect: {
            id: feedId
          }
        },
        text
      });
      return comment;
    }
  }
};