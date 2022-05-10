import { Request, Response } from "express";
import { pickupFind } from "../../model/repository/pickup.repository";
import logger from "../../util/logger";

const NAMESPACE = "Client Pickup Point";

export const getAllPickupPoints = async (req: Request, res: Response) => {
  try {
    const pickupList = await pickupFind({ where: { is_delete: 0 } });

    return res.json({ data: pickupList, errmsg: "", errno: 0 });
  } catch (error: any) {
    logger.error(NAMESPACE, error.message, error);
    return res.status(500).json({ errmsg: error.message, errno: 500 });
  }
};

// export const getPickupPointDetail = async (req: Request, res: Response) => {
//     let
// }
