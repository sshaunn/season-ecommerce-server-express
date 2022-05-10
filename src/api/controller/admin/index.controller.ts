import { Request, Response } from "express";
import logger from "../../util/logger";
import { goodsCount } from "../../model/repository/goods.repository";
import { userFindBy, usersCount } from "../../model/repository/user.repository";
import { orderCount, orderCountBy, orderSumBy } from "../../model/repository/order.repository";
import { settingFindOne } from "../../model/repository/setting.repository";
import { Between, In, LessThanOrEqual, MoreThan, MoreThanOrEqual } from "typeorm";
import { cartFindBy } from "../../model/repository/cart.repository";

const NAMESPACE = "Index";

const getIndexInfo = async (req: Request, res: Response) => {
  let { pindex } = req.query;
  let todayTimeStamp = new Date().setHours(0, 0, 0, 0) / 1000; // today 00:00 time stamp
  let yesterdatTimeStamp = todayTimeStamp - 86400; // yesterday 00:00 time stamp
  let sevenDaysBeforeTimeStamp = todayTimeStamp - 86400 * 7; // a week ago 00:00 time stamp
  let oneMonthBeforeTimeStamp = todayTimeStamp - 86400 * 30; // a month ago 00:00 time stamp

  if (Number(pindex) === 0) {
    await Promise.all([
      userFindBy({
        id: MoreThan(1),
        register_time: MoreThanOrEqual(todayTimeStamp),
      }),
      userFindBy({
        id: MoreThan(1),
        register_time: LessThanOrEqual(todayTimeStamp),
        last_login_time: MoreThanOrEqual(todayTimeStamp),
      }),
      cartFindBy({ is_delete: 0, add_time: MoreThanOrEqual(todayTimeStamp) }),
      orderSumBy({ is_delete: 0, add_time: MoreThanOrEqual(todayTimeStamp) }),
      orderCountBy({ is_delete: 0, add_time: MoreThanOrEqual(todayTimeStamp) }),
      orderCountBy({
        is_delete: 0,
        add_time: MoreThanOrEqual(todayTimeStamp),
        order_status: In([201, 802, 300, 301]),
      }),
      orderSumBy({
        is_delete: 0,
        add_time: MoreThanOrEqual(todayTimeStamp),
        order_status: In([201, 802, 300, 301]),
      }),
    ])
      .then((data) => {
        return res.json({
          data: {
            newData: data[0],
            newUser: data[0].length,
            oldData: data[1],
            oldUser: data[1].length,
            addCart: data[2].length,
            addOrderSum: data[3] ? data[3] : 0,
            addOrderNum: data[4],
            payOrderNum: data[5],
            payOrderSum: data[6] ? data[6] : 0,
          },
        });
      })
      .catch((error) => {
        logger.error(NAMESPACE, error.message, error);
        return res.status(500).json({
          errmsg: error.message,
          errno: 500,
          error,
        });
      });
  }

  if (Number(pindex) === 1) {
    await Promise.all([
      userFindBy({
        id: MoreThan(1),
        register_time: Between(yesterdatTimeStamp, todayTimeStamp),
      }),
      userFindBy({
        id: MoreThan(1),
        register_time: LessThanOrEqual(yesterdatTimeStamp),
        last_login_time: Between(yesterdatTimeStamp, todayTimeStamp),
      }),
      cartFindBy({ is_delete: 0, add_time: Between(yesterdatTimeStamp, todayTimeStamp) }),
      orderSumBy({ is_delete: 0, add_time: Between(yesterdatTimeStamp, todayTimeStamp) }),
      orderCountBy({ is_delete: 0, add_time: Between(yesterdatTimeStamp, todayTimeStamp) }),
      orderCountBy({
        is_delete: 0,
        add_time: Between(yesterdatTimeStamp, todayTimeStamp),
        order_status: In([201, 802, 300, 301]),
      }),
      orderSumBy({
        is_delete: 0,
        add_time: Between(yesterdatTimeStamp, todayTimeStamp),
        order_status: In([201, 802, 300, 301]),
      }),
    ])
      .then((data) => {
        return res.json({
          data: {
            newData: data[0],
            newUser: data[0].length,
            oldData: data[1],
            oldUser: data[1].length,
            addCart: data[2].length,
            addOrderSum: data[3] ? data[3] : 0,
            addOrderNum: data[4],
            payOrderNum: data[5],
            payOrderSum: data[6] ? data[6] : 0,
          },
        });
      })
      .catch((error) => {
        logger.error(NAMESPACE, error.message, error);
        return res.status(500).json({
          errmsg: error.message,
          errno: 500,
          error,
        });
      });
  }

  if (Number(pindex) === 2) {
    await Promise.all([
      userFindBy({
        id: MoreThan(1),
        register_time: MoreThanOrEqual(sevenDaysBeforeTimeStamp),
      }),
      userFindBy({
        id: MoreThan(1),
        register_time: LessThanOrEqual(sevenDaysBeforeTimeStamp),
        last_login_time: MoreThanOrEqual(sevenDaysBeforeTimeStamp),
      }),
      cartFindBy({ is_delete: 0, add_time: MoreThanOrEqual(sevenDaysBeforeTimeStamp) }),
      orderSumBy({ is_delete: 0, add_time: MoreThanOrEqual(sevenDaysBeforeTimeStamp) }),
      orderCountBy({ is_delete: 0, add_time: MoreThanOrEqual(sevenDaysBeforeTimeStamp) }),
      orderCountBy({
        is_delete: 0,
        add_time: MoreThanOrEqual(sevenDaysBeforeTimeStamp),
        order_status: In([201, 802, 300, 301]),
      }),
      orderSumBy({
        is_delete: 0,
        add_time: MoreThanOrEqual(sevenDaysBeforeTimeStamp),
        order_status: In([201, 802, 300, 301]),
      }),
    ])
      .then((data) => {
        return res.json({
          data: {
            newData: data[0],
            newUser: data[0].length,
            oldData: data[1],
            oldUser: data[1].length,
            addCart: data[2].length,
            addOrderSum: data[3] ? data[3] : 0,
            addOrderNum: data[4],
            payOrderNum: data[5],
            payOrderSum: data[6] ? data[6] : 0,
          },
        });
      })
      .catch((error) => {
        logger.error(NAMESPACE, error.message, error);
        return res.status(500).json({
          errmsg: error.message,
          errno: 500,
          error,
        });
      });
  }
  if (Number(pindex) === 3) {
    await Promise.all([
      userFindBy({
        id: MoreThan(1),
        register_time: MoreThanOrEqual(oneMonthBeforeTimeStamp),
      }),
      userFindBy({
        id: MoreThan(1),
        register_time: LessThanOrEqual(oneMonthBeforeTimeStamp),
        last_login_time: MoreThanOrEqual(oneMonthBeforeTimeStamp), //
      }),
      cartFindBy({ is_delete: 0, add_time: MoreThanOrEqual(oneMonthBeforeTimeStamp) }),
      orderSumBy({ is_delete: 0, add_time: MoreThanOrEqual(oneMonthBeforeTimeStamp) }),
      orderCountBy({ is_delete: 0, add_time: MoreThanOrEqual(oneMonthBeforeTimeStamp) }),
      orderCountBy({
        is_delete: 0,
        add_time: MoreThanOrEqual(oneMonthBeforeTimeStamp),
        order_status: In([201, 802, 300, 301]),
      }),
      orderSumBy({
        is_delete: 0,
        add_time: MoreThanOrEqual(oneMonthBeforeTimeStamp),
        order_status: In([201, 802, 300, 301]),
      }),
    ])
      .then((data) => {
        return res.json({
          data: {
            newData: data[0],
            newUser: data[0].length,
            oldData: data[1],
            oldUser: data[1].length,
            addCart: data[2].length,
            addOrderSum: data[3] ? data[3] : 0,
            addOrderNum: data[4],
            payOrderNum: data[5],
            payOrderSum: data[6] ? data[6] : 0,
          },
        });
      })
      .catch((error) => {
        logger.error(NAMESPACE, error.message, error);
        return res.status(500).json({
          errmsg: error.message,
          errno: 500,
          error,
        });
      });
  }
};

const getIndexCardsInfo = async (req: Request, res: Response) => {
  try {
    const goodsOnSale = await goodsCount({ where: { is_on_sale: 1, is_delete: 0 } });
    const orderToDelivery = await orderCountBy({ order_status: 300 });
    const timestamp = await settingFindOne({ select: ["countdown"], take: 1 });

    if (!timestamp) {
      return res.status(404).json({
        errmsg: "Time stamp not fount...",
        errno: 404,
      });
    }

    const user = await usersCount();

    return res.json({
      data: {
        goodsOnSale,
        orderToDelivery,
        timestamp,
        user,
      },
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

export default { getIndexInfo, getIndexCardsInfo };
