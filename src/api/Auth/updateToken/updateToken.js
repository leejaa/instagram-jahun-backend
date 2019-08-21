import { prisma } from "../../../../generated/prisma-client";
import { generateToken, fnLog } from "../../../utils";

export default {
  Mutation: {
    updateToken: async (_, args, { request }) => {

fnLog(`updateToken 진입...`);

      const { user } = request;
      const { token } = args;

        const updatedUser = await prisma.updateUser({
          where: { id: user.id },
          data: {
            token: token
          }
        });

        return user;

    }
  }
};