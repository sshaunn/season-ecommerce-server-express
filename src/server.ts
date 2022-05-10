import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import bodyParser from "body-parser";
import routes from "./api/router/router.config";
import logger from "./api/util/logger";
import fileUpload from "express-fileupload";
import { dataSource } from "./api/model/data-source";

const NAMESPACE = "Server";

dataSource
  .initialize()
  .then(async () => {
    logger.info(NAMESPACE, "Data Source has been initialized...");
  })
  .catch((error) => {
    logger.error(NAMESPACE, error.message, error);
  });

const api = express();
api.use(express.static("www/static/store_images"));
api.use(express.static("www/static/user_upload"));
api.use(fileUpload({ createParentPath: true }));
api.use(express.json());
api.use(express.urlencoded({ extended: true }));
api.use(cors());
// api.use(bodyParser.json());
// api.use(express.urlencoded({ extended: true }));

api.use((req: Request, res: Response, next: NextFunction) => {
  /** Log the req */
  logger.info(
    NAMESPACE,
    `METHOD: [${req.method}] - URL: [${req.url}] - IP: [${req.socket.remoteAddress}]`
  );

  res.on("finish", () => {
    /** Log the res */
    logger.info(
      NAMESPACE,
      `METHOD: [${req.method}] - URL: [${req.url}] - STATUS: [${res.statusCode}] - IP: [${req.socket.remoteAddress}]`
    );
  });

  next();
});

api.use("/", routes.router);

api.listen(process.env.SERVER_PORT, () => {
  logger.info(
    NAMESPACE,
    `Server is Listening at ${process.env.SERVER_HOSTNAME}:${process.env.SERVER_PORT}`
  );
});
