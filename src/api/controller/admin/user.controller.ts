import { Request, Response } from "express";
import logger from "../../util/logger";
import {
  usersCount,
  userFind,
  update,
  userFindOneBy,
} from "../../model/repository/user.repository";
import moment from "moment";
import { In, LessThan, Like } from "typeorm";
import { cartCountBy, cartFind, cartSumBy } from "../../model/repository/cart.repository";
import {
  orderCountBy,
  orderFindAndCount,
  orderSumBy,
} from "../../model/repository/order.repository";
import {
  orderAUCount,
  orderAUFind,
  orderAUFindAndCount,
} from "../../model/repository/order_au.repository";
import { orderGoodsFind } from "../../model/repository/order_goods.repository";
import { regionFindOne } from "../../model/repository/region.repository";
import { setOrderBtnText, setOrderStatusText } from "../../util/orderStatus.util";
import { addressFindAndCount, addressUpdate } from "../../model/repository/address.repository";
import { footprintCount, footprintFind } from "../../model/repository/footprint.repository";
import {
  addressAUFindAndCount,
  addressAUUpdate,
} from "../../model/repository/address_au.repository";

const NAMESPACE = "User";

const getAllUsers = async (req: Request, res: Response): Promise<void> => {
  let { page, nickname } = req.query;

  nickname = nickname ? Buffer.from(nickname as string).toString("base64") : "";
  let pageSize = 10;

  await Promise.all([
    userFind({
      where: {
        nickname: Like(`%${nickname}%`),
      },
      order: {
        id: "DESC",
      },
      skip: page ? (Number(page) - 1) * pageSize : 0,
      take: pageSize,
    }),
    usersCount({
      where: {
        nickname: Like(`%${nickname}%`),
      },
    }),
  ])
    .then((result) => {
      const totalPages = Math.ceil(result[1] / pageSize);
      for (const item of result[0]) {
        item.register_time = moment
          .unix(item.register_time as number)
          .format("YYYY-MM-DD HH:mm:ss");
        item.last_login_time = moment
          .unix(item.last_login_time as number)
          .format("YYYY-MM-DD HH:mm:ss");
        item.nickname = item.nickname ? Buffer.from(item.nickname, "base64").toString() : "已删除";
      }

      return res.json({
        data: {
          userData: {
            count: result[1],
            currentPage: page,
            data: result[0],
            pageSize,
            totalPages,
          },
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
};

const getUserInfo = async (req: Request, res: Response) => {
  let { id } = req.query;

  await userFindOneBy({ id: Number(id) })
    .then((user) => {
      if (user) {
        user.register_time = moment
          .unix(user.register_time as number)
          .format("YYYY-MM-DD HH:mm:ss");
        user.last_login_time = moment
          .unix(user.last_login_time as number)
          .format("YYYY-MM-DD HH:mm:ss");
        user.nickname = Buffer.from(user.nickname, "base64").toString();
        return res.json({
          data: user,
          errmsg: "",
          errno: 0,
        });
      }
      return res.status(404).json({
        message: "User not found...",
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
};

const updateUserNickname = async (req: Request, res: Response): Promise<void> => {
  let { id, nickname } = req.body;
  nickname = nickname ? Buffer.from(nickname).toString("base64") : nickname;
  await update(id, { nickname: nickname })
    .then(() => {
      return res.json({
        data: 1,
        errmsg: "",
        errno: 0,
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
};

const updateUserName = async (req: Request, res: Response) => {
  let { id, name } = req.body;

  name ? name : "";

  await update(id, { name: name })
    .then(() => {
      return res.json({
        data: 1,
        errmsg: "",
        errno: 0,
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
};

const updateUserPhonenumber = async (req: Request, res: Response) => {
  let { id, mobile } = req.body;

  await update(id, { mobile: mobile })
    .then(() => {
      return res.json({
        data: 1,
        errmsg: "",
        errno: 0,
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
};

const getUserActionInfo = async (req: Request, res: Response) => {
  let { id } = req.query;

  try {
    const orderSum = await orderAUCount({
      where: { user_id: Number(id), is_delete: 0 },
      // order: { create_time: "DESC" },
    });
    const orderDone = await orderAUCount({
      where: { user_id: Number(id), order_status: In(["301", "401"]), is_delete: 0 },
      // order: { create_time: "DESC" },
    });
    const orderList = await orderAUFind({
      where: { user_id: Number(id), order_status: In(["301", "401"]), is_delete: 0 },
      // order: { create_time: "DESC" },
    });
    let orderMoney = orderList.reduce((total, order) => total + Number(order.total_price), 0);

    const cartList = await cartFind({
      select: ["number"],
      where: { user_id: Number(id), is_delete: 0 },
    });

    let cartSum = cartList.reduce((total, cart) => total + cart.number, 0);
    return res.json({
      data: {
        orderSum,
        orderDone,
        orderMoney,
        cartSum,
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

const getUserOrderAUInfo = async (req: Request, res: Response) => {
  let { id, page } = req.query;
  let pageSize: number = 10;

  try {
    const [orderList, count] = await orderAUFindAndCount({
      relations: ["orderGoods", "userInfo"],
      where: {
        user_id: Number(id),
        order_status: In([101, 201, 301, 401]),
        is_delete: 0,
        orderGoods: { is_delete: 0 },
      },
      order: { id: "DESC" },
      take: pageSize,
      skip: (Number(page) - 1) * pageSize,
    });
    let totalPages = Math.ceil(count / pageSize);
    orderList.forEach((order) => {
      order.goodsCount = order.orderGoods.reduce((total, goods) => total + goods.number, 0);

      order.full_address =
        order.is_pickup === 1
          ? `${order.pickup_address}, ${order.pickup_suburb}, ${order.pickup_postcode}, ${"VIC"}`
          : `${order.delivery_address}, ${order.delivery_suburb}, ${
              order.delivery_postcode
            }, ${"VIC"}`;

      order.create_time = moment.unix(order.create_time as number).format("YYYY-MM-DD HH:mm:ss");

      order.order_status_text = setOrderStatusText(Number(order.order_status)) || "";
      order.button_text = setOrderBtnText(Number(order.order_status)) || "";
      order.postscript = Buffer.from(order.postscript, "base64").toString();
      order.userInfo.nickname = Buffer.from(order.userInfo.nickname, "base64").toString();
    });

    return res.json({
      data: {
        count,
        currentPage: page,
        data: orderList,
        pageSize,
        totalPages,
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

const getUserOrderInfo = async (req: Request, res: Response) => {
  let { id, page } = req.query;
  let pageSize: number = 10;

  await orderFindAndCount({
    where: {
      user_id: Number(id),
      order_type: LessThan(8),
    },
    order: {
      id: "DESC",
    },
    skip: (Number(page) - 1) * 10,
    take: pageSize,
  })
    .then(async ([orderData, count]) => {
      let totalPages = Math.ceil(count / pageSize);

      for (let order of orderData) {
        let goodsCount: number = 0;

        const goodsList = await orderGoodsFind({
          select: {
            goods_name: true,
            list_pic_url: true,
            number: true,
            goods_specification_name_value: true,
            retail_price: true,
          },
          where: {
            order_id: order.id,
            is_delete: 0,
          },
        });

        goodsList.forEach((goods) => {
          goodsCount += goods.number;
        });

        let province_name = await regionFindOne({
          select: {
            name: true,
          },
          where: {
            id: order.province,
          },
        });

        let city_name = await regionFindOne({
          select: {
            name: true,
          },
          where: {
            id: order.city,
          },
        });

        let district_name = await regionFindOne({
          select: {
            name: true,
          },
          where: {
            id: order.district,
          },
        });

        let full_region = province_name?.name + " " + city_name?.name + " " + district_name?.name;

        order.postscript = Buffer.from(order.postscript, "base64").toString();

        order.add_time = moment.unix(order.add_time as number).format("YYYY-MM-DD HH:mm:ss");

        let order_status_text = setOrderStatusText(order.order_status);

        let button_text = setOrderBtnText(order.order_status);

        order = Object.assign(order, {
          goodsCount,
          goodsList,
          province_name,
          city_name,
          district_name,
          full_region,
          postscript: order.postscript,
          add_time: order.add_time,
          order_status_text,
          button_text,
        });
      }

      return res.json({
        data: {
          count,
          currentPage: page,
          data: orderData,
          pageSize,
          totalPages,
        },
        errmsg: "",
        errno: 0,
      });
    })
    .catch((error) => {
      logger.error(NAMESPACE, error.message, error);
      return res.status(500).json({
        message: error.message,
        error,
      });
    });
};

const getUserAddress = async (req: Request, res: Response) => {
  let { id, page } = req.query;
  let pageSize: number = 10;

  try {
    const [addressList, count] = await addressAUFindAndCount({ where: { user_id: Number(id) } });
    addressList.forEach(async (address) => {
      address.full_region = `${address?.street}, ${address?.suburb}, ${address?.state}, ${address?.postcode}`;
    });

    let totalPages = Math.ceil(count / pageSize);

    return res.json({
      data: {
        data: addressList,
        count,
        pageSize,
        currentPage: page,
        totalPages,
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

const updateUserAddress = async (req: Request, res: Response) => {
  let { contact_name, contact_number, street, suburb, postcode_id, postcode, id, is_default } =
    req.body;
  console.log(req.body);
  try {
    const addressUpdateResult = await addressAUUpdate(id, {
      contact_name,
      contact_number,
      street,
      suburb,
      postcode_id,
      postcode,
      is_default,
    });

    return res.json({
      data: req.body,
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

const getUserCarts = async (req: Request, res: Response) => {
  let { id, page } = req.query;

  let pageSize: number = 10;
  await Promise.all([
    cartFind({
      where: {
        user_id: Number(id),
      },
      take: pageSize,
      skip: (Number(page) - 1) * pageSize,
    }),
    cartCountBy({ user_id: Number(id) }),
  ])
    .then(([carts, count]) => {
      let totalPages = Math.ceil(count / Number(pageSize));

      return res.json({
        count,
        currentPage: page,
        data: carts,
        pageSize,
        totalPages,
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
};

const getUserFootprint = async (req: Request, res: Response) => {
  let { id, page } = req.query;
  let pageSize: number = 10;
  await Promise.all([
    footprintFind({
      where: {
        user_id: Number(id),
      },
      take: pageSize,
      skip: (Number(page) - 1) * 10,
    }),
    footprintCount({
      where: {
        user_id: Number(id),
      },
    }),
  ])
    .then(([rowDataPacket, count]) => {
      let totalPages = Math.ceil(count / pageSize);
      if (count === 0) {
        return res.status(404).json({
          message: "unknown error...",
        });
      }
      return res.json({
        data: {
          count,
          currentPage: page,
          data: rowDataPacket,
          pageSize,
          totalPages,
        },
      });
    })
    .catch((error) => {
      logger.error(NAMESPACE, error.message, error);
      return res.status(500).json({
        message: error.message,
        error,
      });
    });
};

export default {
  getAllUsers,
  updateUserNickname,
  getUserInfo,
  getUserActionInfo,
  updateUserName,
  updateUserPhonenumber,
  getUserOrderInfo,
  getUserAddress,
  updateUserAddress,
  getUserCarts,
  getUserFootprint,
  getUserOrderAUInfo,
};
