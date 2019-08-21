import { prisma } from "../../../../generated/prisma-client";
import { fnLog } from "../../../utils";

export default {
  Query: {
    seeFeeds: async (_, args, { request, isAuthenticated }) => {

      isAuthenticated(request);

      const { feedId } = args;

      const { user } = request

      fnLog(`feedId : ${feedId}`);

      const following = await prisma.user({ id: user.id }).following();

      fnLog(`following : ${JSON.stringify(following)}`);

      if(feedId){
        
        // const feeds = await prisma.feeds({
        //   where : {
        //     id : feedId
        //   }
        // });

        const feeds = await prisma.feeds({
          where: {
              id: feedId
          }
        });

        fnLog(`feeds : ${JSON.stringify(feeds)}`);
  
        return feeds;
      }else{

        const feeds = await prisma.feeds({
          where: {
              user: {
                id_in : [...following.map(user => user.id), user.id]
              }
          },
          orderBy: "createdAt_DESC"
        });

        fnLog(`feeds : ${JSON.stringify(feeds)}`);

        if(feeds.length > 0){
          return feeds;
        }else{
          const result = await prisma.feeds();
          return result;
        }
      }
    }
  }
};