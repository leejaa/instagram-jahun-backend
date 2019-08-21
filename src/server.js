import "./env";
import { GraphQLServer } from "graphql-yoga";
import logger from "morgan";
import cors from "cors";
import axios from "axios"
import qs from 'qs';
import schema from "./schema";
import { authenticateJwt, isAuthenticated } from "./config";
import { fnLog } from "./utils";
import { uploadMiddleware, uploadController } from "./upload";
import { prisma } from "../generated/prisma-client";

const PORT = process.env.PORT || 4000;

const server = new GraphQLServer({
    schema
    , context: ({ request }) => ({ request, isAuthenticated })
  });

server.express.use(logger("dev"));
server.express.use(authenticateJwt);
server.express.use(cors());
server.express.post("/api/upload", uploadMiddleware, uploadController);

server.express.get("/kakao", async(req, res)=>{
  console.log('요청....');
  console.log('req.query');
  console.log(req.query);
  console.log('req.body');
  console.log(req.body);


  try {
    const {code, state} = req.query;

    if(code){

      console.log(`code값 : ${code}`);
      console.log(`state : ${state}`);

      const data = {
          'grant_type': "authorization_code"
          , 'client_id': process.env.CLIENT_ID
          , 'redirect_uri': process.env.REDIRECT_URI
          , 'code': code 
      }

        const options = {
          method: 'POST',
          headers: { 'Content-type': 'application/x-www-form-urlencoded;charset=utf-8' },
          data: qs.stringify(data),
          url: 'https://kauth.kakao.com/oauth/token',
        };

        const result = await axios(options);

        const {access_token , refresh_token } = result.data;

        console.log(`access_token : ${access_token}`);

        const result2 = await axios.get('https://kapi.kakao.com/v2/user/me', {
          headers: { // 요청 헤더
            'Authorization': `Bearer ${access_token}`
          }
        });

        const {data: {
          properties: {
            nickname
            , profile_image
          },
          kakao_account: {
            email
          }
        }} = result2;

        const userExist = await prisma.user({
          email: email
        });

        if(userExist){
          await prisma.updateUser({
            where: {
              id: userExist.id
            },
            data:{
              authPassword: state
              , avatar: profile_image
            }
          });
        }else{
          await prisma.createUser({
            username: nickname
            , avatar: profile_image
            , email: email
            , authPassword: state
          });
        }

    }else{
      res.send('인증과정에서 오류가 발생하였습니다.');
    }

  } catch (error) {
    console.log(`error2 : ${error}`);
    res.send(error);
  }

  res.send('인증이 완료되었습니다. 앱으로 돌아가 다음단계를 진행해주세요.');
});

server.express.get("/kakaoLogin", async(req, res)=>{

  const { state } = req.query;

  console.log(`state : ${state}`);

  const user = await prisma.users({
    where: {
      authPassword: state
    }
  });

  console.log(`user !! : ${JSON.stringify(user)}`);

  res.json(user);
});


server.start({port : PORT}, () => {
    console.log(`Server running on Port is a  ${PORT}`);
});