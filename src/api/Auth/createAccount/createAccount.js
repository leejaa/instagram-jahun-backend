import { isAuthenticated } from "../../../config";
import { prisma } from "../../../../generated/prisma-client";
import { fnLog } from "../../../utils";

export default {
  Mutation: {
    createAccount: async (_, args, { request }) => {

        fnLog(`createAccount enter...`);

        const {email, username} = args;

        const userExists = await prisma.$exists.user({
            email: email,
        });

        fnLog(`userExists : ${JSON.stringify(userExists, null, 2)}`);

        if(userExists){
            throw Error("이미 존재하는 이메일 주소입니다.");
        }
        
            const user = await prisma.createUser({
                username
                , email
            });

        // fnLog(`user : ${JSON.stringify(user, null, 2)}`);

        return user;
      
    }
  }
};