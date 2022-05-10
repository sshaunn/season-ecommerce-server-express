import { Request, Response } from "express";
import { Like } from "typeorm";
import Region from "../../model/entity/region.entity";
import { orderFind, orderFindAndCount, orderUpdate } from "../../model/repository/order.repository";
import { regionFindBy } from "../../model/repository/region.repository";
import logger from "../../util/logger";

const NAMESPACE = "Order";

const getAllRegion = async (req: Request, res: Response) => {
  let allRegionsInfo: any[] = [];
  await Promise.all([
    regionFindBy({ type: 1 }),
    regionFindBy({ type: 2 }),
    regionFindBy({ type: 3 }),
  ])
    .then(([regionsLvOne, regionsLvTwo, regionsLvThree]) => {
      let children: any = [];

      for (let regionlv1 of regionsLvOne) {
        let innerChildren: any = [];

        for (let regionlv2 of regionsLvTwo) {
          regionsLvThree.map((regionlv3) => {
            if (regionlv3.parent_id === regionlv2.id) {
              innerChildren.push({
                value: regionlv3.id,
                label: regionlv3.name,
              });
            }
          });

          if (regionlv2.parent_id === regionlv1.id) {
            children = {
              ...children,
              value: regionlv2.id,
              label: regionlv2.name,
              children: innerChildren,
            };
          }
        }

        allRegionsInfo.push({
          value: regionlv1.id,
          label: regionlv1.name,
          children,
        });
      }

      return res.json({
        data: allRegionsInfo,
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

const getAllOrders = async (req: Request, res: Response) => {
  let { page, contact_name, contact_number, status } = req.query;
  let pageSize: number = 10;
  contact_name ? contact_name : "";
  contact_number ? contact_number : "";
  // console.log(req.query);

  try {
    if (status === "100") {
      // console.log("12312312313123123123");
      const [orders, count] = await orderFindAndCount({
        relations: ["orderGoods", "userInfo"],
        where: {
          mobile: Like(`%${contact_number}%`),
          pay_name: Like(`%${contact_name}%`),
          orderGoods: { is_delete: 0 },
        },
        order: { add_time: "DESC" },
        take: pageSize,
        skip: (Number(page) - 1) * pageSize,
      });
      let totalPages = Math.ceil(count / pageSize);
      for (let order of orders) {
        let tmpno = 0;
        order.userInfo.nickname
          ? (order.userInfo.nickname = Buffer.from(order.userInfo.nickname, "base64").toString())
          : (order.userInfo.nickname = "deleted");
        order.orderGoods.forEach((goods) => {
          tmpno += goods.number;
        });
        order.goodsCount = tmpno;
      }

      return res.json({
        data: {
          count,
          currentPage: page,
          data: orders,
          pageSize,
          totalPages,
        },
        errmsg: "",
        errno: 0,
      });
    } else {
      const [orders, count] = await orderFindAndCount({
        relations: ["orderGoods", "userInfo"],
        where: {
          order_status: Number(status),
          mobile: Like(`%${contact_number}%`),
          pay_name: Like(`%${contact_name}%`),
          orderGoods: { is_delete: 0 },
        },
        order: { add_time: "DESC" },
        take: pageSize,
        skip: (Number(page) - 1) * pageSize,
      });
      let totalPages = Math.ceil(count / pageSize);
      for (let order of orders) {
        let tmpno = 0;
        order.userInfo.nickname
          ? (order.userInfo.nickname = Buffer.from(order.userInfo.nickname, "base64").toString())
          : (order.userInfo.nickname = "deleted");
        order.orderGoods.forEach((goods) => {
          tmpno += goods.number;
        });
        order.goodsCount = tmpno;
      }

      return res.json({
        data: {
          count,
          currentPage: page,
          data: orders,
          pageSize,
          totalPages,
        },
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

const getOrderDetail = async (req: Request, res: Response) => {
  let { id } = req.query;
  try {
    const orders = await orderFind({
      relations: ["orderGoods", "userInfo"],
      where: { id: Number(id), orderGoods: { is_delete: 0 } },
    });
    orders[0].goodsCount = orders[0].orderGoods.length;
    orders[0].userInfo.nickname = Buffer.from(orders[0].userInfo.nickname, "base64").toString();

    return res.json({
      data: orders[0],
      errmsg: "",
      errno: 0,
    });
  } catch (error: any) {
    return res.status(500).json({
      message: error.message,
      error,
    });
  }
};

const updateOrderDetail = async (req: Request, res: Response) => {
  let { order_id, admin_memo, order_status } = req.body;
  console.log(req.body);
  try {
    if (admin_memo) {
      const updateResult = await orderUpdate(order_id, { admin_memo: admin_memo });
      if (updateResult.affected === 0) {
        return res.status(404).json({
          message: "Order updated failed... Order not found...",
        });
      } else {
        return res.json({
          affected: updateResult.affected,
          errmsg: "",
          errno: 0,
        });
      }
    }
    if (order_status) {
      const updateResult = await orderUpdate(order_id, { order_status: order_status });
      if (updateResult.affected === 0) {
        return res.status(404).json({
          message: "Order updated failed... Order not found...",
        });
      } else {
        return res.json({
          affected: updateResult.affected,
          errmsg: "",
          errno: 0,
        });
      }
    }
  } catch (error: any) {
    logger.error(NAMESPACE, error.message, error);

    return res.status(500).json({
      message: error.message,
      error,
    });
  }
};

const updateOrderStatus = async (req: Request, res: Response) => {
  let { order_id, admin_memo, order_status } = req.body;
  console.log(req.body);
  try {
    if (admin_memo) {
      const updateResult = await orderUpdate(order_id, { admin_memo: admin_memo });
      if (updateResult.affected === 0) {
        return res.status(404).json({
          message: "Order updated failed... Order not found...",
        });
      } else {
        return res.json({
          affected: updateResult.affected,
          errmsg: "",
          errno: 0,
        });
      }
    }
    if (order_status) {
      const updateResult = await orderUpdate(order_id, { order_status: order_status });
      if (updateResult.affected === 0) {
        return res.status(404).json({
          message: "Order updated failed... Order not found...",
        });
      } else {
        return res.json({
          affected: updateResult.affected,
          errmsg: "",
          errno: 0,
        });
      }
    }
  } catch (error: any) {
    logger.error(NAMESPACE, error.message, error);

    return res.status(500).json({
      message: error.message,
      error,
    });
  }
};

export default { updateOrderStatus, getAllRegion, getAllOrders, getOrderDetail, updateOrderDetail };
