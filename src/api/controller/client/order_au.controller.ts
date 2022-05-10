import { Request, Response } from "express";
import moment from "moment";
import { FindManyOptions, FindOptionsWhere } from "typeorm";
import { Query } from "../../interface/types";
import Cart from "../../model/entity/cart.entity";
import OrderAU from "../../model/entity/order_au.entity";
import OrderGoods from "../../model/entity/order_goods.entity";
import { addressAUFindOneOrFailBy } from "../../model/repository/address_au.repository";
import { cartFind, cartFindBy, cartUpdateById } from "../../model/repository/cart.repository";
import {
  orderAUCount,
  orderAUFindAndCount,
  orderAUFindOne,
  orderAUFindOneBy,
  orderAUFindOneByOrFail,
  orderAUInsert,
  orderAUUpdate,
  orderAUUpdateById,
} from "../../model/repository/order_au.repository";
import {
  orderGoodsFind,
  orderGoodsFindBy,
  orderGoodsInsert,
} from "../../model/repository/order_goods.repository";
import { pickupFindOneBy } from "../../model/repository/pickup.repository";
import { productFindOneBy } from "../../model/repository/product.repository";
import logger from "../../util/logger";
import { generateOrderSNNumber } from "../../util/orderStatus.util";
import { freight_price } from "./cart.controller";

const NAMESPACE = "ClientOrderAU";
// let freight_price = 0;
export const getAllOrderList = async (req: Request, res: Response) => {
  let { status, size, page } = req.query;
  let userId = req.user_id;

  try {
    let whereClause: FindOptionsWhere<OrderAU> = { user_id: userId, is_delete: 0 };
    // console.log(userId);
    const isMainOrderPage: boolean = status === "001";
    if (!isMainOrderPage) whereClause = { ...whereClause, order_status: String(status) };

    const [orderList, count] = await orderAUFindAndCount({
      relations: ["orderGoods", "userInfo"],
      where: {
        ...whereClause,
        orderGoods: { is_delete: 0 },
      },
      order: { create_time: "DESC" },
      take: Number(size),
      skip: (Number(page) - 1) * Number(size),
    });

    // deal with user nickname if it's string in base64...
    // set up all keys value pair needed
    orderList.forEach((order) => {
      order.userInfo.nickname =
        order.userInfo.nickname !== null
          ? Buffer.from(order.userInfo.nickname, "base64").toString()
          : "";

      order.goodsCount = order.orderGoods.reduce((total, item) => total + item.number, 0);
      order.create_time = moment(Number(order.create_time) * 1000).format("YYYY-MM-DD HH:mm:ss");
    });
    const totalPages = Math.ceil(count / Number(size));
    const data = { count, currentPage: page, orders: orderList, totalPages };
    return res.json({ data, errmsg: "", errno: 0, user_id: userId });
  } catch (error: any) {
    logger.error(NAMESPACE, error.message, error);
    return res.status(500).json({ errmsg: error.message, errno: 500, error });
  }
};

export const getAllOrderCountByStatus = async (req: Request, res: Response) => {
  let userId = req.user_id;

  try {
    const statusList: number[] = [101, 201, 301, 401];
    // const cache = new WeakMap();
    const orderCountList = await Promise.all(
      statusList.map(async (status) => {
        return await orderAUCount({
          where: { user_id: userId, is_delete: 0, order_status: status },
        });
        // cache.set([status], count);
      })
    );
    // console.log(cache.get([101]));
    let data: any;
    for (let i = 0; i < statusList.length; i++) {
      data = { ...data, [statusList[i]]: orderCountList[i] };
    }
    return res.send({ data, errmsg: "", errno: 0 });
  } catch (error: any) {
    logger.error(NAMESPACE, error.message, error);
    return res.status(500).json({ errmsg: error.message, errno: 500, error });
  }
};

export const getOrderDetail = async (req: Request, res: Response) => {
  let { order_id } = req.query;
  let userId = req.user_id;
  order_id = String(order_id);

  const statusTable: any = {
    101: "待付款",
    201: "待确认",
    301: "待收货",
    401: "已收货",
  };

  try {
    const orderDetail = await orderAUFindOne({
      relations: ["orderGoods", "userInfo"],
      where: { user_id: userId, id: order_id, orderGoods: { is_delete: 0, order_id: order_id } },
    });
    // validate order...
    // const hasOrder: boolean = orderDetail !== null;
    const isAuthorized: boolean = userId !== null || userId !== undefined;

    if (!isAuthorized) return res.status(401).json({ errmsg: "Unauthorization...", errno: 401 });

    if (!orderDetail) return res.status(404).json({ errmsg: "Order not found...", errno: 404 });
    else {
      orderDetail.create_time = moment(Number(orderDetail.create_time) * 1000)
        .local(true)
        .format("YYYY-MM-DD HH:mm");

      orderDetail.pay_time =
        orderDetail.pay_time !== null
          ? moment(Number(orderDetail.pay_time) * 1000)
              .local(true)
              .format("YYYY-MM-DD HH:mm")
          : null;

      orderDetail.confirm_time =
        orderDetail.confirm_time !== null
          ? moment(Number(orderDetail.confirm_time) * 1000)
              .local(true)
              .format("YYYY-MM-DD HH:mm")
          : null;

      orderDetail.finish_time =
        orderDetail.finish_time !== null
          ? moment(Number(orderDetail.finish_time) * 1000)
              .local(true)
              .format("YYYY-MM-DD HH:mm")
          : null;

      orderDetail.userInfo.nickname =
        orderDetail.userInfo.nickname !== null
          ? Buffer.from(orderDetail.userInfo.nickname, "base64").toString()
          : "";

      orderDetail.goodsCount = orderDetail.orderGoods.reduce(
        (total, item) => total + item.number,
        0
      );

      orderDetail.order_status = statusTable[orderDetail.order_status];

      return res.json({
        data: orderDetail,
        errmsg: "",
        errno: 0,
      });
    }
  } catch (error: any) {
    logger.error(NAMESPACE, error.message, error);
    return res.status(500).json({ errmsg: error.message, errno: 500, error });
  }
};

export const submitOrder = async (req: Request, res: Response) => {
  const userId = req.user_id;
  let {
    address_id,
    contact_name,
    contact_number,
    is_pickup,
    order_type,
    payment_method,
    postscript,
  } = req.body;
  const isPickup: boolean = is_pickup === 1;
  // let freight_price: number = 0;
  let freightPrice = 0;
  freightPrice = isPickup ? 0 : freight_price;
  logger.debug(NAMESPACE, "freighPrice: ", freightPrice);
  try {
    const checkedCartItemList = await cartFindBy({ user_id: userId, checked: 1, is_delete: 0 });
    const hasCartItem: boolean = checkedCartItemList.length > 0;
    if (!hasCartItem) return res.status(400).send({ errmsg: "Cart is empty...", errno: 400 });

    const validCheckedCartItemList = await Promise.all(
      checkedCartItemList.map(async (cart) => {
        const product = await productFindOneBy({ id: cart.product_id });
        if (product) {
          const isValidCartItem: boolean =
            cart.number <= product.goods_number && cart.add_price === cart.retail_price;

          if (isValidCartItem) return cart;
        }
      })
    );

    // Get difference between checkedCartItemList and validCheckedCartItemList,
    // to find out which item exactly is(are) not valid and send it back to client
    const invalidCheckedCartItemList = checkedCartItemList.filter((checkedItem) => {
      return !validCheckedCartItemList.some((validItem) => {
        return checkedItem === validItem;
      });
    });

    const hasInvalidCartItem: boolean = invalidCheckedCartItemList.length > 0;
    if (hasInvalidCartItem) {
      const invalidCartItemName = invalidCheckedCartItemList.map((cart) => cart.goods_name).join();
      return res.status(400).send({
        errmsg: `${invalidCartItemName} out of stock, or price has been changed`,
        errno: 400,
      });
    }

    const total_price = checkedCartItemList.reduce(
      (total, item) => total + item.number * item.retail_price,
      freightPrice
    );

    let addressInfo;
    if (isPickup) {
      const pickupPoint = await pickupFindOneBy({ id: address_id });
      if (pickupPoint) {
        addressInfo = {
          pickup_address: pickupPoint.address,
          pickup_postcode: pickupPoint.postcode,
          pickup_suburb: pickupPoint.suburb,
          delivery_contact_name: contact_name,
          delivery_contact_number: contact_number,
        };
      }
    } else {
      const addressAU = await addressAUFindOneOrFailBy({ id: address_id, user_id: userId });
      addressInfo = {
        delivery_address: addressAU.street,
        delivery_postcode: addressAU.postcode,
        delivery_suburb: addressAU.suburb,
        delivery_contact_name: contact_name,
        delivery_contact_number: contact_number,
      };
    }

    const currentTime = moment().local(true).unix();

    const orderInfo = {
      ...addressInfo,
      order_sn: generateOrderSNNumber,
      order_type,
      create_time: currentTime,
      user_id: userId,
      postscript,
      order_status: 101,
      payment_method,
      offline_pay: payment_method === 501 ? 1 : 0,
      pay_status: 0,
      print_status: 0,
      freight_price: freightPrice,
      total_price,
      is_pickup,
      is_delete: 0,
    };

    const orderInsertResult = await orderAUInsert(orderInfo);
    const insertOrderGoodsData = checkedCartItemList.map((cartItem) => {
      return {
        user_id: userId,
        order_id: orderInsertResult.identifiers[0].id,
        goods_id: cartItem.goods_id,
        product_id: cartItem.product_id,
        goods_name: cartItem.goods_name,
        goods_aka: cartItem.goods_aka,
        list_pic_url: cartItem.list_pic_url,
        retail_price: cartItem.retail_price,
        number: cartItem.number,
        goods_specification_name_value: cartItem.goods_specification_name_value,
        goods_specification_ids: cartItem.goods_specification_ids,
      };
    });

    await orderGoodsInsert(insertOrderGoodsData);

    return res.json({ data: orderInfo, errmsg: "", errno: 0 });
  } catch (error: any) {
    logger.error(NAMESPACE, error.message, error);
    return res.status(500).json({ errmsg: error.message, errno: 500, error });
  }
};

export const cancelOrder = async (req: Request, res: Response) => {
  let { id } = req.body;
  let userId = req.user_id;
  try {
    const orderDetail = await orderAUFindOneBy({ id: id });
    if (!userId) return res.status(401).json({ errmsg: "Unauthorization...", errno: 401 });
    if (!orderDetail) return res.status(404).send({ errmsg: "Order not found...", errno: 404 });
    else {
      const isCancelableOrder: boolean =
        orderDetail.order_status === 101 || orderDetail.order_status === 201;

      if (isCancelableOrder) {
        await orderAUUpdateById(id, { is_delete: 1 });
        return res.json({ data: orderDetail, errmsg: "", errno: 0 });
      } else {
        return res.status(400).send({ errmsg: "Cannot cancel this order...", errno: 400 });
      }
    }
  } catch (error: any) {
    logger.error(NAMESPACE, error.message, error);
    return res.status(500).json({ errmsg: error.message, errno: 500, error });
  }
};

export const confirmOrder = async (req: Request, res: Response) => {
  let { order_id, url } = req.body;
  const userId = req.user_id;

  const currentTime = moment().local(true).unix();

  try {
    await orderAUUpdate(
      { transfer_screenshot_url: url, pay_time: currentTime, order_status: 201 },
      { id: order_id, user_id: userId }
    );

    const orderDetail = await orderAUFindOneByOrFail({ id: order_id });

    const checkedCartItemList = await cartFindBy({ user_id: userId, checked: 1, is_delete: 0 });
    await Promise.all(
      checkedCartItemList.map(async (item) => {
        await cartUpdateById(String(item.id), { is_delete: 1, checked: 0 });
      })
    );
    return res.send({ data: orderDetail, errmsg: "", errno: 0 });
  } catch (error: any) {
    logger.error(NAMESPACE, error.message, error);
    return res.status(500).send({ errmsg: error.message, errno: 500, error });
  }
};

export const getOrderGoodsList = async (req: Request, res: Response) => {
  let { order_id } = req.query;
  let userId = req.user_id;

  try {
    const isValidOrder: boolean = Number(order_id) > 0;

    if (isValidOrder) {
      const orderGoods = await orderGoodsFindBy({ user_id: userId, order_id: String(order_id) });
      return res.send({ data: orderGoods, errmsg: "", errno: 0 });
    } else {
      const orderGoods = await cartFindBy({
        user_id: userId,
        checked: 1,
        is_delete: 0,
        is_fast: 0,
      });
      return res.send({ data: orderGoods, errmsg: "", errno: 0 });
    }
  } catch (error: any) {
    logger.error(NAMESPACE, error.message, error);
  }
};

// export const
