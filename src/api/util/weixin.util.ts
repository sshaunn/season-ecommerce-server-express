import crypto from "crypto";
import config from "../config/config";

export const decryptUserInfo = async (sessionKey: any, encryptedData: any, iv: any) => {
  const _sessionKey = Buffer.from(sessionKey, "base64");
  encryptedData = Buffer.from(encryptedData, "base64");
  iv = Buffer.from(iv, "base64");
  let decode: any;

  try {
    const decipher = crypto.createCipheriv("aes-128-cbc", _sessionKey, iv);
    decipher.setAutoPadding(true);
    decode = decipher.update(encryptedData, "binary", "utf8");
    decode += decipher.final("utf8");
    decode = JSON.parse(decode);

    if (decode.watermark.appid !== config.weixin.appid) return "";
    return decode;
  } catch (error: any) {
    return error.message;
  }
};
