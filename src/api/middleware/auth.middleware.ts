import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import config from "../config/config";
import logger from "../util/logger";
import Admin from "../model/entity/admin.entity";
import User from "../model/entity/user.entity";
import { decode } from "punycode";

const NAMESPACE = "Auth";

const signJWT = (
  admin: Admin | User | any,
  callback: (error: Error | null, token: string | null) => void
): void => {
  var timeSinceEpoch = new Date().getTime();
  var expirationTime = timeSinceEpoch + Number(config.server.token.expireTime) * 100000;
  var expirationTimeInSeconds = Math.floor(expirationTime / 1000);

  logger.info(NAMESPACE, `Attempting to sign token for ${admin.id}`);

  try {
    jwt.sign(
      {
        username: admin.username,
        is_delete: admin.is_delete,
      },
      config.server.token.secret,
      {
        issuer: config.server.token.issuer,
        algorithm: "HS256",
        expiresIn: expirationTimeInSeconds,
      },
      (error, token) => {
        if (error) {
          callback(error, null);
        } else if (token) {
          callback(null, token);
        }
      }
    );
  } catch (error: any) {
    logger.error(NAMESPACE, error.message, error);
    callback(error, null);
  }
};

const userSignJWT = (
  client: any,
  callback: (error: Error | null, token: string | null) => void
): void => {
  let timeSinceEpoch = new Date().getTime();
  let expirationTime = timeSinceEpoch + Number(config.server.token.expireTime) * 100000;
  let expirationTimeInSeconds = Math.floor(expirationTime / 1000);

  logger.info(NAMESPACE, `Attempting to sign token for ${client.openid}`);

  try {
    jwt.sign(
      {
        username: client.username,
        session_key: client.session_key,
        openid: client.openid,
        user_id: client.user_id,
      },
      config.server.token.secret,
      {
        issuer: config.server.token.issuer,
        algorithm: "HS256",
        expiresIn: expirationTimeInSeconds,
      },
      (error, token) => {
        if (error) {
          callback(error, null);
        } else if (token) {
          callback(null, token);
        }
      }
    );
  } catch (error: any) {
    logger.error(NAMESPACE, error.message, error);
    callback(error, null);
  }
};

const validateToken = (req: Request, res: Response, next: NextFunction) => {
  logger.info(NAMESPACE, "Validating token");

  let token = req.headers.authorization?.split(" ")[1];
  // let token = req.headers["X-Nideshop-Token"];
  if (token) {
    /** token.secret = 'aibuild.com' */
    jwt.verify(token, config.server.token.secret, (error, decoded: any) => {
      if (error) {
        return res.status(404).json({
          errmsg: error.message + " Plz login...",
          errno: 401,
          error,
        });
      } else {
        res.locals.jwt = decoded;
        console.log(decoded);
        if (decoded.user_id) req.user_id = decoded.user_id;
        next();
        return;
      }
    });
  } else {
    return res.status(401).json({
      errmsg: "Unauthorized",
      errno: 401,
    });
  }
};

const authMiddleWare = {
  signJWT,
  validateToken,
  userSignJWT,
};

export default authMiddleWare;
