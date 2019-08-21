import { prisma } from "../../../../generated/prisma-client";
import { fnLog } from "../../../utils";

 export default {
  Mutation: {
    updateUser: async (_, args, { request, isAuthenticated }) => {
      isAuthenticated(request);
      const { user } = request;
      const { url } = args;
      try {

        await prisma.updateUser({
            where: { id: user.id },
            data: {
                avatar: url
            }
        });

        return url;
      } catch(error){

        fnLog(`error : ${error}`);

        return null;
      }
    }
  }
}