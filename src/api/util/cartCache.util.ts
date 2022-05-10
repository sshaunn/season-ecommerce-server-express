import { Request } from "express";
import { CartInfoIndex } from "../interface/cart";
import { cartFind, cartUpdate } from "../model/repository/cart.repository";
import { orderGoodsFind } from "../model/repository/order_goods.repository";
import { productFindOneBy } from "../model/repository/product.repository";
import logger from "./logger";

const NAMESPACE = "ClientCartUtil";

/**
 *
 * Expensive computed here, not sure if it has any memory leak then set weakmap here...
 *
 * @param req http Request send from front-end app,
 * @param purchaseType if user want to purchase products immediately, purchaseType is 1, in Sql where clause, is_fast: 1
 * @returns object {cartList: Cart[], cartTotal: {...}}
 */
export const getCartInfoCache = async (req: Request, purchaseType: number = 0) => {
  logger.info(NAMESPACE, "Caching User Cart Info...");

  const cache = new WeakMap();
  //   const result = cache.get(req);

  const userId = req.user_id === null || req.user_id === undefined ? 0 : req.user_id;

  // const isFastPurchase: boolean = purchaseType === 1;
  // const whereClause = isFastPurchase ? { is_fast: 1 } : { is_fast: 0 };

  try {
    const cartList = await cartFind({ where: { user_id: userId, is_delete: 0 } });

    let numberChange: number = 0;

    await Promise.all(
      cartList.map(async (cart) => {
        const product = await productFindOneBy({ id: cart.product_id, is_delete: 0 });

        if (!product) {
          await cartUpdate(
            { is_delete: 1 },
            { product_id: cart.product_id, user_id: userId, is_delete: 0 }
          );
        } else {
          const productNum = product.goods_number;

          const isAvailableProduct: boolean = productNum > 0 && product.is_on_sale === 1;
          const isBeyondCartNumber: boolean = productNum > 0 && productNum < cart.number;
          const isAbleCheckedCart: boolean = productNum > 0 && cart.number === 0;

          if (!isAvailableProduct) {
            await cartUpdate(
              { checked: 0 },
              { product_id: cart.product_id, user_id: userId, checked: 1, is_delete: 0 }
            );
          }
          if (isBeyondCartNumber) {
            cart.number = productNum;
            numberChange = 1;
          }
          if (isAbleCheckedCart) {
            cart.number = 1;
            numberChange = 1;
          }

          cart.weight_count = cart.number * Number(cart.goods_weight);

          await cartUpdate(
            { number: cart.number, add_price: cart.retail_price },
            { product_id: cart.product_id, user_id: userId, is_delete: 0 }
          );
        }
      })
    );
    const goodsCount = cartList.reduce((total, cartItem) => total + cartItem.number, 0);
    const goodsAmount = cartList
      .reduce((total, cartItem) => total + cartItem.number * cartItem.retail_price, 0)
      .toFixed(2);
    const checkedCartList = cartList.filter((cart) => cart.checked === 1);
    const checkedGoodsCount = checkedCartList.reduce(
      (total, cartItem) => total + cartItem.number,
      0
    );
    const checkedGoodsAmount = checkedCartList
      .reduce((total, cartItem) => total + cartItem.retail_price * cartItem.number, 0)
      .toFixed(2);

    const checkedGoodsWeight = checkedCartList.reduce(
      (total, cartItem) => total + cartItem.goods_weight * cartItem.number,
      0
    );

    const cartTotal = {
      goodsCount,
      goodsAmount,
      checkedGoodsCount,
      checkedGoodsAmount,
      user_id: userId,
      numberChange,
      checkedGoodsWeight,
    };

    const data: CartInfoIndex = { cartList, cartTotal };
    cache.set(req, data);

    console.log(userId);
    return data;
  } catch (error: any) {
    logger.error(NAMESPACE, error.message, error);
    throw new Error(error);
  }
};
