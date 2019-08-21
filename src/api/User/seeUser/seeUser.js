import { prisma } from "../../../../generated/prisma-client";
import { fnLog } from "../../../utils";

export default {
  Query: {
    seeUser: async (_, args, { request }) => {
      
      const { id } = args;
      const { user } = request;

      fnLog(`id : ${id}`);

      let paramId;

      if(id){
        paramId = id;
      }else{
        paramId = user.id;
      }

      return prisma.user({ id : paramId });
    }
  }
};