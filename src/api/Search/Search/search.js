import { prisma } from "../../../../generated/prisma-client";
import { fnLog } from "../../../utils";

 export default {
  Query: {
    search: async (_, args) => {

      const { term } = args;

      fnLog(`term : ${term}`);

      if(term){

        const result = await prisma.feeds({
          where: {
            OR: [
              { title_contains : term }
              , { content_contains : term }
            ]
          }
        });

        fnLog(`result : ${JSON.stringify(result)}`);

          return result;
        }else{

          const result = await prisma.feeds();

            return result;
      }

    }
  }
};