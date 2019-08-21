import { isAuthenticated } from "../../../config";
import { prisma } from "../../../../generated/prisma-client";
import { fnLog, generateSecret, sendSecretMail } from "../../../utils";

export default {
  Mutation: {
    requestSecret: async (_, args, { request }) => {

        const { email } = args;

        const authPassword = generateSecret();

fnLog(`authPassword : ${authPassword}`);

        try {
            await prisma.updateUser({
                 data: { authPassword }, 
                 where: { email } 
            });

            await sendSecretMail(email, authPassword);

            return true;
        } catch (error) {
fnLog(`error : ${error}`);
            return false;
        }
    }
  }
};