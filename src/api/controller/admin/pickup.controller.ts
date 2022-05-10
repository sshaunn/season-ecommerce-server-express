import logger from "../../util/logger";
import { Request, Response } from "express";
import {
  pickupFind,
  pickupInsert,
  pickupUpdateById,
} from "../../model/repository/pickup.repository";
import { validateNewvalues } from "../../util/addressValidator";

const NAMESPACE = "PickupPoint";

const getAllPickupPoint = async (req: Request, res: Response) => {
  try {
    const pickupPoints = await pickupFind({ where: { is_delete: 0 } });
    return res.json({
      data: pickupPoints,
      errmsg: "",
      errno: 0,
    });
  } catch (error: any) {
    logger.error(NAMESPACE, error.message, error);

    return res.status(500).json({
      errmsg: error.message,
      errno: 500,
      error,
    });
  }
};

const getPickupPoint = async (req: Request, res: Response) => {
  let { id } = req.query;
  console.log(id);

  try {
    const pickupPoints = await pickupFind({ where: { id: Number(id) } });
    if (pickupPoints.length === 0) {
      return res.status(404).json({
        message: "Pickup Point not found...",
      });
    }
    return res.json({
      data: pickupPoints[0],
      errmsg: "",
      errno: 0,
    });
  } catch (error: any) {
    logger.error(NAMESPACE, error.message, error);
    return res.status(500).json({
      errmsg: error.message,
      errno: 500,
      error,
    });
  }
};

const updatePickupPoint = async (req: Request, res: Response) => {
  let { id, newValues } = req.body;
  try {
    if (validateNewvalues(newValues)) {
      const result = await pickupUpdateById(id, newValues);
      return res.status(200).json({
        data: result,
        errmsg: "",
        errno: 0,
      });
    } else {
      logger.error(NAMESPACE, "Address validating error");
      return res.status(400).json({
        message: "Address input error, please re enter",
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

const addPickupPoint = async (req: Request, res: Response) => {
  let point = req.body;

  try {
    const result = await pickupInsert(point);
    return res.json({
      data: 1,
      errmsg: "",
      errno: 0,
    });
  } catch (error: any) {
    logger.error(NAMESPACE, error.message, error);
    return res.status(500).json({
      errmsg: error.message,
      errno: 500,
      error,
    });
  }
};

const deletePickupPoint = async (req: Request, res: Response) => {
  let { id } = req.body;

  try {
    const result = await pickupUpdateById(id, { is_delete: 1 });
    if (result.affected === 0) {
      return res.status(404).json({
        message: "Pickup Point not found...",
      });
    }
    return res.json({
      data: 1,
      errmsg: "",
      errno: 0,
    });
  } catch (error: any) {
    logger.error(NAMESPACE, error.message, error);
    return res.status(500).json({
      errmsg: error.message,
      errno: 500,
      error,
    });
  }
};

export default {
  getAllPickupPoint,
  getPickupPoint,
  updatePickupPoint,
  addPickupPoint,
  deletePickupPoint,
};
