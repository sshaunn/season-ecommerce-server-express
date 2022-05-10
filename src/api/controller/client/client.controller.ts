import { Request, Response } from "express";
import logger from "../../util/logger";
import config from "../../config/config";
import rp from "request-promise";
import crypto from "crypto";
import { v4 as uuidv4 } from "uuid";
import { decryptUserInfo } from "../../util/weixin.util";
import { userFind, userInsert, userUpdate } from "../../model/repository/user.repository";
import authMiddleWare from "../../middleware/auth.middleware";

const NAMESPACE = "Client";

const clientLogin = async (req: Request, res: Response) => {
  console.log("1");
  let { code, userInfo } = req.body;
  let currentTime = Math.floor(new Date().getTime() / 1000);

  console.log(code);
  try {
    const clientInfo = userInfo.userInfo;
    // To get user openid
    console.log(clientInfo);
    const options = {
      method: "GET",
      url: "https://api.weixin.qq.com/sns/jscode2session",
      qs: {
        grant_type: "authorization_code",
        js_code: code,
        secret: config.weixin.secret,
        appid: config.weixin.appid,
      },
    };

    let sessionData = await rp(options);
    // console.log(sessionData.openid);
    sessionData = JSON.parse(sessionData);
    // return res.json(sessionData);
    if (!sessionData.openid) {
      return res.status(400).send(sessionData);
    }
    const sha1 = crypto
      .createHash("sha1")
      .update(userInfo.rawData + sessionData.session_key)
      .digest("hex");
    if (sha1 !== userInfo.signature) {
      return res.status(400).send({
        errmsg: "Login failed...",
        errno: 400,
      });
    }

    const weixinUserInfo = await decryptUserInfo(
      sessionData.session_key,
      userInfo.encryptedData,
      userInfo.iv
    );
    if (!weixinUserInfo) return res.status(400).send("Login failed, pleas try again...");
    const user = await userFind({ where: { weixin_openid: sessionData.openid } });
    let is_new = 0;
    let tempUser;
    if (user.length === 0) {
      let nickname = Buffer.from(clientInfo.nickName).toString("base64");
      tempUser = await userInsert({
        username: "微信用户" + uuidv4(),
        password: sessionData.openid,
        register_time: currentTime,
        register_ip: req.socket.remoteAddress,
        last_login_time: currentTime,
        last_login_ip: req.socket.remoteAddress,
        mobile: "",
        weixin_openid: sessionData.openid,
        avatar: clientInfo.avatar || "",
        gender: clientInfo.gender || 1,
        nickname,
        country: clientInfo.country,
        province: clientInfo.province,
        city: clientInfo.city,
      });
      is_new = 1;
    }
    // console.log(tempUser);
    sessionData = { ...sessionData, user_id: tempUser ? tempUser.identifiers[0].id : user[0].id };

    let newNickname = Buffer.from(clientInfo.nickName).toString("base64");
    const updateResult = await userUpdate(tempUser ? tempUser.identifiers[0].id : user[0].id, {
      last_login_time: currentTime,
      last_login_ip: req.socket.remoteAddress,
      avatar: clientInfo.avatarUrl,
      nickname: newNickname,
      country: clientInfo.country,
      province: clientInfo.province,
      city: clientInfo.city,
    });

    const newUserInfo = await userFind({
      where: { id: tempUser ? tempUser.identifiers[0].id : user[0].id },
    });
    if (newUserInfo.length === 0) return res.status(400).send("Login failed, please retry...");
    newUserInfo[0].nickname = Buffer.from(newUserInfo[0].nickname, "base64").toString();
    const client = {
      session_key: sessionData.session_key,
      openid: sessionData.openid,
      user_id: tempUser ? tempUser.identifiers[0].id : user[0].id,
    };
    authMiddleWare.userSignJWT(client, (error, token) => {
      if (error) {
        return res.status(401).json({
          errmsg: error.message,
          errno: 401,
          error,
        });
      } else if (token) {
        logger.info(NAMESPACE, "Auth Successful and return token");
        return res.status(200).json({
          data: {
            token,
            userInfo: newUserInfo[0],
            is_new,
          },
          errmsg: "",
          errno: 0,
        });
      }
    });
    // return client;
  } catch (error: any) {
    logger.error(NAMESPACE, error.message, error);
    return res.status(500).json({
      errno: 500,
      errmsg: error.message,
      error,
    });
  }
};

export default { clientLogin };
