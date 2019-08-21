import { prisma } from "../../../../generated/prisma-client";
import { fnLog } from "../../../utils";

export default {
  Query: {
    seeAllUser: async (_, args, { request }) => {

        const result = await prisma.users();

        fnLog(`result : ${JSON.stringify(result)}`);

      return result;
    }
  }
};