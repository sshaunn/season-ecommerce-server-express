import { Request, Response } from "express";
import logger from "../../util/logger";
import CartRepository, { cartFindAndCount } from "../../model/repository/cart.repository";
import { Like } from "typeorm";
import moment from "moment";

const NAMESPACE = "Cart";

const getAllCartItems = async (req: Request, res: Response) => {
  let { page, name } = req.query;

  const pageSize = 10;

  try {
    name = name === undefined || name === null ? "" : name;
    const [cartList, count] = await cartFindAndCount({
      where: { goods_name: Like(`%${name}%`) },
      order: { id: "DESC" },
      take: pageSize,
      skip: (Number(page) - 1) * pageSize,
    });

    const totalPages = Math.ceil(count / Number(page));

    cartList.forEach((item) => {
      item.add_time = moment.unix(Number(item.add_time)).format("YYYY-MM-DD HH:mm:ss");
      item.nickname = item.nickname ? Buffer.from(item.nickname, "base64").toString() : "已删除";
    });

    return res.send({ data: { data: cartList, totalPages, count, page }, errmsg: "", errno: 0 });
  } catch (error: any) {
    logger.error(NAMESPACE, error.message, error);
    return res.status(500).json({ errmsg: error.message, errno: 500, error });
  }
};

export default { getAllCartItems };
