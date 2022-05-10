import { Request, Response } from "express";
import logger from "../../util/logger";

const NAMESPACE = "Upload";

const uploadImage = async (req: Request, res: Response) => {
  let files = req.files;
  try {
    if (!files || files === {}) {
      return res.json({
        message: "No images uploaded",
      });
    } else {
      let image: any = files.image;
      // const name = image.md5;
      const [name, type] = image.name.split(".");
      const nameHash = image.md5;
      image.mv(`www/static/store_images/${nameHash}.${type}`);
      return res.json({
        data: `${nameHash}.${type}`,
        errmsg: "",
        errno: 0,
      });
    }
  } catch (error: any) {
    logger.error(NAMESPACE, error.message, error);
    return res.status(500).json({
      errmsg: error.message,
      errno: 500,
      error,
    });
  }
};

export default { uploadImage };
