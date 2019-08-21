import { prisma } from "../../../../generated/prisma-client";
import { fnLog } from "../../../utils";
import axios from "axios";

export default {
    Query: {
        messages: async(_, args, { request, isAuthenticated }) => {

            isAuthenticated(request);

            const { user } = request;

fnLog(`messages user : ${JSON.stringify(user)}`);

            const { to } = args;

            fnLog(`to : ${to}`);

            const messages = await prisma.messages({
                where : {
                    AND : {
                        to : {
                            id_in : [user.id, to]
                        }
                        , from : {
                            id_in : [user.id, to]
                        }
                    }
                 }
                , orderBy : "createdAt_ASC"
                , last : 12
            });

            fnLog(`message : ${JSON.stringify(messages)}`);

           return messages;
        },
        allUsers: async(_, args, { request, isAuthenticated }) => {

            const { user } = request;

            fnLog(`allUsers user : ${JSON.stringify(user)}`);

            const allUsers = await prisma.users({
                where : {
                    NOT : {
                        id : user.id
                    }
                },
                first : 10
            });

            return allUsers;
        }
    },
    
      Mutation: {
        sendMessage: async(_, args, { request, isAuthenticated }) => {

            isAuthenticated(request);

            const { user } = request;
            const { text, to } = args;

            const toUser = await prisma.user({id : to});

            fnLog(`toUser : ${JSON.stringify(toUser)}`);

            if(toUser.token){
                const { data } = await axios.post(
                    "https://exp.host/--/api/v2/push/send", 
                    {
                        to : toUser.token,
                        title : "알림",
                        body : "메시지가 도착하였습니다."
                    }
                );
                fnLog(`data : ${JSON.stringify(data)}`);
            }


            return prisma.createMessage({
              text : text
              , from : {
                  connect : {
                      id : user.id
                  }
              }
              , to : {
                  connect : {
                      id : to
                  }
              }
            });
        }
      },
      Subscription: {
        newMessage: {
          subscribe: async(_, args, { request, isAuthenticated }) => {

//            const { user } = request;

            const { from, to} = args;

            const node = await prisma.$subscribe.message({
                node : {
                    from : {
                        id_in : [from, to]
                    }
                    , to : {
                        id_in : [from, to]
                    }
                }
            }).node();

            console.log(`node : ${JSON.stringify(node)}`);

            return node;
          },
          resolve: payload => payload
        }
      },
      Message:{
          from: ({id}) => prisma.message({id}).from()
          , to: ({id}) => prisma.message({id}).to()
      }
};