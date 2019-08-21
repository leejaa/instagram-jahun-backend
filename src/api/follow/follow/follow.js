import { prisma } from "../../../../generated/prisma-client";
import { fnLog } from "../../../utils";

 export default {
  Mutation: {
    follow: async (_, args, { request, isAuthenticated }) => {
      isAuthenticated(request);
      const { id } = args;
      const { user } = request;
      try {

        fnLog(`id : ${id}`);

        const isFollowing = await prisma.$exists.user({
            AND: [
                {
                    id : user.id
                }
                ,{
                    following_some : {
                        id : id
                    }
                }
            ]
        });

        fnLog(`isFollowing : ${isFollowing}`);

        if(isFollowing){
            await prisma.updateUser({
                where: { id: user.id },
                data: {
                  following: {
                    disconnect: {
                      id
                    }
                  }
                }
              });
        }else{
            await prisma.updateUser({
              where: { id: user.id },
              data: {
                following: {
                  connect: {
                    id
                  }
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