import { Request, Response } from "express";
import { showSetFindOne } from "../../model/repository/show_settings.repository";
import { userFindBy, userFindOne, userUpdate } from "../../model/repository/user.repository";

import logger from "../../util/logger";

const NAMESPACE = "ClientSettings";

const getShowSettings = async (req: Request, res: Response) => {
  try {
    const showSet = await showSetFindOne({ where: { id: 1 } });

    if (showSet) return res.json({ data: showSet, errmsg: "", errno: 0 });
    else return res.status(404).json({ errmsg: "Show Settings not found...", errno: 404 });
  } catch (error: any) {
    logger.error(NAMESPACE, error.message, error);
    return res.status(500).json({ errmsg: "", errno: 0, error });
  }
};

const getUserDetail = async (req: Request, res: Response) => {
  let userId = req.user_id;
  try {
    const userDetail = await userFindOne({ select: ["name", "mobile"], where: { id: userId } });

    const hasUser: boolean = userDetail !== null;

    if (hasUser) return res.send({ data: userDetail, errmsg: "", errno: 0 });
    else return res.status(404).json({ errmsg: "User not found...", errno: 404 });
  } catch (error: any) {
    logger.error(NAMESPACE, error.message, error);
    return res.status(500).json({ errmsg: error.message, errno: 500 });
  }
};

const saveUserDetail = async (req: Request, res: Response) => {
  let { mobile, name } = req.body;
  let userid = req.user_id;
  try {
    const isValidMobile: boolean =
      mobile.length >= 9 && /^0?(3|4)[0-9]{8}$/.test(mobile) && mobile !== "" && mobile !== null;
    const isValidName: boolean = name !== "" && name !== null;

    if (!isValidMobile)
      return res.status(400).send({ errmsg: "Mobile Number is invalid...", errno: 400 });
    if (!isValidName) return res.status(400).json({ errmsg: "Name is invalid...", errno: 400 });

    await userUpdate(userid, { name, mobile, name_mobile: 1 });

    return res.send({ data: 1, errmsg: "", errno: 0 });
  } catch (error: any) {
    logger.error(NAMESPACE, error.message, error);
    return res.status(500).json({ errmsg: error.message, errno: 500, error });
  }
};

export default { getShowSettings, getUserDetail, saveUserDetail };
