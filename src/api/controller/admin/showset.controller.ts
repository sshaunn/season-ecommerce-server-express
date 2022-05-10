import { Request, Response } from "express";
import { showSetFind } from "../../model/repository/show_settings.repository";
import logger from "../../util/logger";

const NAMESPACE = "ShowSettings";

const getShowSet = async (req: Request, res: Response) => {
  try {
    const showsets = await showSetFind();
    return showsets;
  } catch (error: any) {
    logger.error(NAMESPACE, error.message, error);

    return res.status(500).json({
      errmsg: error.message,
      errno: 500,
      error,
    });
  }
};
