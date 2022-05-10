import { Request, Response } from "express";
import logger from "../../util/logger";
import {
  orderAUFindAndCount,
  orderAUFindOne,
  orderAUFindOneBy,
  orderAUUpdateById,
} from "../../model/repository/order_au.repository";
import { FindOptionsWhere, Like } from "typeorm";
import moment from "moment";

const NAMESPACE = "AdminOrderAU";

const getOrderAUIndex = async (req: Request, res: Response) => {
  let { page, contact_name, contact_number, status } = req.query;
  let pageSize: number = 10;

  let condition: any = Number(status) === 100 ? {} : { order_status: Number(status), is_delete: 0 };

  condition = contact_name
    ? { ...condition, delivery_contact_name: Like(`%${contact_name}%`) }
    : { ...condition };
  condition = contact_number
    ? { ...condition, delivery_contact_number: Like(`%${contact_number}%`) }
    : { ...condition };

  try {
    const [orderList, count] = await orderAUFindAndCount({
      relations: ["orderGoods", "userInfo"],
      select: {
        userInfo: {
          avatar: true,
          mobile: true,
          name: true,
          nickname: true,
        },
        orderGoods: true,
      },
      where: { ...condition, orderGoods: { is_delete: 0 } },
      order: { create_time: "DESC" },
      take: pageSize,
      skip: (Number(page) - 1) * pageSize,
    });

    let totalPages = Math.ceil(count / pageSize);
    orderList.forEach((order) => {
      order.userInfo.nickname = order.userInfo.nickname
        ? Buffer.from(order.userInfo.nickname, "base64").toString()
        : "Deleted";
      order.goodsCount = order.orderGoods.reduce((total, item) => total + item.number, 0);
    });

    return res.json({
      data: {
        count,
        currentPage: page,
        data: orderList,
        pageSize,
        totalPages,
      },
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

const updateOrder = async (req: Request, res: Response) => {
  let { admin_memo, order_id, order_status, changed_total_price } = req.body;

  let currentTime = moment().local().unix();

  let updateData: any = order_status
    ? { order_status: order_status, changed_total_price: changed_total_price || 0 }
    : { admin_memo: admin_memo, changed_total_price: changed_total_price || 0 };

  updateData =
    Number(order_status) === 401 ? { ...updateData, finish_time: currentTime } : updateData;

  updateData =
    Number(order_status) === 301 ? { ...updateData, confirm_time: currentTime } : updateData;

  try {
    const updateResult = await orderAUUpdateById(order_id, updateData);
    if (updateResult.affected === 0) {
      return res.status(401).json({
        errmsg: "Empty set updated...",
        errno: 401,
      });
    }
    const updatedOrder = await orderAUFindOneBy({ id: order_id });
    return res.json({
      data: updatedOrder,
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

const getOrderAUDetail = async (req: Request, res: Response) => {
  let { id } = req.query;

  try {
    const order = await orderAUFindOne({
      relations: ["orderGoods", "userInfo"],
      select: {
        orderGoods: true,
        userInfo: {
          avatar: true,
          mobile: true,
          name: true,
          nickname: true,
          country: true,
          province: true,
          city: true,
        },
      },
      where: { id: Number(id) },
    });

    if (order) {
      order.userInfo.nickname = Buffer.from(order.userInfo.nickname, "base64").toString();
      order.goodsCount = order.orderGoods.reduce((total, item) => total + item.number, 0);

      return res.json({
        data: order,
        errmsg: "",
        errno: 0,
      });
    } else {
      return res.status(404).json({
        errmsg: "Order not found...",
        errno: 404,
      });
    }
  } catch (error: any) {
    logger.error(NAMESPACE, error.message, error);
    return res.status(500).json({
      errmsg: error.message,
      errno: 500,
    });
  }
};

export default { getOrderAUIndex, updateOrder, getOrderAUDetail };
