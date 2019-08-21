import passport from "passport";
import { Strategy, ExtractJwt } from "passport-jwt";
import { prisma } from "../generated/prisma-client";
import { fnLog } from "./utils";

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET
};

const verifyUser = async (payload, done) => {

//fnLog(`payload id : ${payload.id}`);

  try {
    const user = await prisma.user({ id: payload.id });

//fnLog(`select user : ${JSON.stringify(user)}`);

    if (user !== null) {
      return done(null, user);
    } else {
      return done(null, false);
    }
  } catch (error) {

fnLog(`error : ${error}`);

    return done(error, false);
  }
};

export const authenticateJwt = (req, res, next) =>
  passport.authenticate("jwt", { sessions: false }, (error, user) => {

    if (user) {
      req.user = user;
    }

    next();
  })(req, res, next);

export const isAuthenticated = request => {

    fnLog(`request query : ${request.body.query}`);

//    fnLog(`request user : ${JSON.stringify(request.user)}`);

    if (!request.user) {
        throw Error("요청하신 데이터에 사용자 정보가 없습니다.");
    }
    return;
};

passport.use(new Strategy(jwtOptions, verifyUser));
passport.initialize();