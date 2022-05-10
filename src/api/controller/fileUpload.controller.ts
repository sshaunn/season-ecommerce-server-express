import { Request, Response } from "express";
import logger from "../util/logger";

const NAMESPACE = "FileUpload";

export const uploadUserProfileImage = async (req: Request, res: Response) => {
  let files = req.files;
  console.log(req.user_id);
  try {
    const hasImages: boolean = files !== null || JSON.stringify(files) !== "{}";

    if (!hasImages) {
      return res.json({ errmsg: "No images uploaded", errno: 400 });
    } else {
      let image: any = files?.image;

      const type = image.name.split(".")[1];
      const nameHash = image.md5;

      image.mv(`www/static/user_upload/${nameHash}.${type}`);
      return res.json({ data: `${nameHash}.${type}`, errmsg: "", errno: 0 });
    }
  } catch (error: any) {
    logger.error(NAMESPACE, error.message, error);
    return res.status(500).json({ errmsg: error.message, errno: 500, error });
  }
};
