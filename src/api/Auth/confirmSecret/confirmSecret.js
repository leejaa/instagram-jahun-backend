import { prisma } from "../../../../generated/prisma-client";
import { generateToken, fnLog } from "../../../utils";

export default {
  Mutation: {
    confirmSecret: async (_, args) => {

fnLog(`confirmSecret 진입...`);

      const { email, authPassword } = args;
      const user = await prisma.user({ email });

// fnLog(`user : ${JSON.stringify(user, null, 2)}`);

      if (user.authPassword === authPassword) {
        await prisma.updateUser({
          where: { id: user.id },
          data: {
            authPassword: ""
          }
        });

        const token = generateToken(user.id);

        console.log(`token : ${token}`);

        return token;
      } else {
        throw Error("이메일 또는 인증번호가 일치하지 않습니다.");
      }
    }
  }
};