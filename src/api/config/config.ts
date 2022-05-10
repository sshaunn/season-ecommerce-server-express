import dotenv from "dotenv";

dotenv.config();

const MYSQL_HOST = process.env.MYSQL_HOST || "localhost";
const MYSQL_DATABASE = process.env.MYSQL_DATABASE || "seasonDevDB";
const MYSQL_USER = process.env.MYSQL_USER || "root";
const MYSQL_PASSWORD = process.env.MYSQL_PASSWORD || "sp100809";
const MYSQL_PORT = Number(process.env.MYSQL_PORT) || 3306;
const MYSQL_PREFIX = process.env.MYSQL_PREFIX || "season_";

const MYSQL = {
  host: MYSQL_HOST,
  port: MYSQL_PORT,
  database: MYSQL_DATABASE,
  user: MYSQL_USER,
  password: MYSQL_PASSWORD,
};

const SERVER_HOSTNAME = process.env.SERVER_HOSTNAME || "localhost";
const SERVER_PORT = process.env.SERVER_PORT || 1337;
const SERVER_TOKEN_EXPIRETIME = process.env.SERVER_TOKEN_EXPIRETIME || 3600;
const SERVER_TOKEN_ISSUER = process.env.SERVER_TOKEN_ISSUER || "aibuild.com";
const SERVER_TOKEN_SECRET = process.env.SERVER_TOKEN_SECRET || "aibuild.com";

const SERVER = {
  hostname: SERVER_HOSTNAME,
  port: SERVER_PORT,
  token: {
    expireTime: SERVER_TOKEN_EXPIRETIME,
    issuer: SERVER_TOKEN_ISSUER,
    secret: SERVER_TOKEN_SECRET,
  },
};

const weixin = {
  // AIBUILD Demo Mini Program (Only for development)
  appid: "wxe8a39bb87f3450bc", // 小程序 appid
  secret: "d81ff6d360244fbb45b1c20d86e35702", // 小程序密钥
  // Production Mini Program
  // appid: "wx1b8fd50ee835a1fa", // 小程序 appid
  // secret: "f57bb669dcb10c7e90227ab3e184ca32", // 小程序密钥
  mch_id: "15988888888", // 商户帐号ID
  partner_key: "asdasdasdasdasdasdasd", // 微信支付密钥
  notify_url: "https://www.您的域名.com/api/pay/notify", // 微信支付异步通知
};

const weixinpay = {
  appid: "wx1b8fd50ee835a1fa",
  mch_id: 402129015,
  store_id: 4041,
  key: "wwxSKMHo6PVIn3gNFFLtnwByHFYMjxb3",
  // notify_url: "https://52.62.171.204:8360/api/pay_au/notify",
  // notify_url: "http://6b7304b39450.ngrok.io/api/pay_au/notify",
  notify_url: "https://season.happyhackers.com.cn/api/pay_au/notify",
  secret: "f57bb669dcb10c7e90227ab3e184ca32",
};

const config = {
  prefix: MYSQL_PREFIX,
  mysql: MYSQL,
  server: SERVER,
  weixin: weixin,
  weixinpay: weixinpay,
};

export default config;
