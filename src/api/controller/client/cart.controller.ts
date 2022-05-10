import e, { Request, Response } from "express";
import { In, MoreThan } from "typeorm";
import {
  cartCountBy,
  cartFind,
  cartFindBy,
  cartFindOne,
  cartInsert,
  cartUpdate,
  cartUpdateById,
} from "../../model/repository/cart.repository";
import { productFindBy, productFindOneBy } from "../../model/repository/product.repository";
import { getCartInfoCache } from "../../util/cartCache.util";
import { CartInfoData, CartInfoIndex } from "../../interface/cart";
import logger from "../../util/logger";
import { goodsFindBy, goodsFindOne } from "../../model/repository/goods.repository";
import { goodsSpecificationFind } from "../../model/repository/goods_specification.repository";
import { orderGoodsFind, orderGoodsFindBy } from "../../model/repository/order_goods.repository";
import {
  addressAUFind,
  addressAUFindBy,
  addressAUFindOneBy,
} from "../../model/repository/address_au.repository";
import { pickupFind, pickupFindOneBy } from "../../model/repository/pickup.repository";
import Cart from "../../model/entity/cart.entity";
import { freightTemplateGroupFindBy } from "../../model/repository/freight_template_group.repository";
import { freightTemplateFindBy } from "../../model/repository/freight_template.repository";
import { orderFind } from "../../model/repository/order.repository";
import { postcodeFindBy } from "../../model/repository/postcode.repository";

const NAMESPACE = "ClientCart";

export let freight_price = 0;

const getCartIndexInfo = async (req: Request, res: Response) => {
  try {
    const data = await getCartInfoCache(req, 0);

    return res.json({
      data,
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

const getGoodsCount = async (req: Request, res: Response) => {
  /**
   * custome update Request interface in file Request.d.ts,
   * user id from req.headers.authorization access token,
   * in middleware validateToken decoded,
   */
  let user_id = req.user_id === undefined || req.user_id === null ? 0 : req.user_id;

  try {
    // const goodsCount = await cartCountBy({ user_id: user_id, is_delete: 0 });
    const cartList = await cartFindBy({ user_id: user_id, is_delete: 0 });
    const goodsCount = cartList.reduce((total, item) => total + item.number, 0);
    const cartTotal = { goodsCount };
    return res.json({ errmsg: "", errno: 0, data: { cartTotal } });
  } catch (err: any) {
    logger.error(NAMESPACE, err.message, err);
    return res.status(500).json({
      errmsg: err.message,
      errno: 500,
      err,
    });
  }
};

const updateCartCheckedStatus = async (req: Request, res: Response) => {
  let { productIds, isChecked } = req.body;
  const user_id = req.user_id;

  let productIdList: number[] = [];
  if (typeof productIds === "number") productIdList.push(productIds);
  else productIdList = productIds;

  try {
    await cartUpdate(
      { checked: isChecked },
      { is_delete: 0, user_id: user_id, product_id: In(productIdList) }
    );
    const data = await getCartInfoCache(req, 0);

    return res.json({
      data,
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

const updateCartGoodsNumber = async (req: Request, res: Response) => {
  let { id, number, productId } = req.body;
  const userId = req.user_id;

  try {
    const product = await productFindOneBy({ id: productId, is_delete: 0 });

    if (product) {
      const isEnoughProduct: boolean = product.goods_number >= number;
      if (!isEnoughProduct) return res.json({ errmsg: "Not enough Products...", errno: 400 });

      const tempData: CartInfoIndex = await getCartInfoCache(req, 0);
      const existCartList = tempData.cartList.filter(
        (cartItem) => cartItem.product_id === product.id
      );
      const isExistProduct: boolean = existCartList.length > 0;
      if (isExistProduct) await cartUpdate({ number: number }, { id: id, is_delete: 0 });
      if (number === 0)
        await cartUpdateById({ user_id: userId, product_id: productId }, { is_delete: 1 });

      const data: CartInfoIndex = await getCartInfoCache(req, 0);
      return res.json({ data, errmsg: "", errno: 0 });
    }
  } catch (error: any) {
    logger.error(NAMESPACE, error.message, error);
    return res.status(500).json({
      errmsg: "",
      errno: 0,
    });
  }
};

const deleteCartItem = async (req: Request, res: Response) => {
  let { productIds } = req.body;
  let userId = req.user_id;

  try {
    await cartUpdate({ is_delete: 1 }, { product_id: productIds, is_delete: 0, user_id: userId });
    const data = await getCartInfoCache(req, 0);

    return res.json({
      data,
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

const addCartItem = async (req: Request, res: Response) => {
  let { addType, goodsId, number, productId } = req.body;
  let userId = req.user_id;
  // let retail_price: number = 0;
  const currentTime = new Date().getTime() / 1000;
  try {
    const [goodsInfo] = await goodsFindBy({
      id: goodsId,
      is_delete: 0,
      // goods_number: MoreThan(0),
      is_on_sale: 1,
    });
    const isValidGoods: boolean = goodsInfo !== null && goodsInfo !== undefined;
    if (!isValidGoods)
      return res.status(400).json({ errmsg: "Goods not valid or not found...", errno: 400 });

    const [productInfo] = await productFindBy({
      id: productId,
      // goods_number: MoreThan(number),
      is_delete: 0,
      is_on_sale: 1,
    });
    const isValidProduct: boolean = productInfo !== null && productInfo !== undefined;
    const hasSpecificationValue: boolean =
      productInfo.goods_specification_ids !== null &&
      productInfo.goods_specification_ids !== undefined;
    if (!isValidProduct)
      return res.json({ errmsg: "Product not valid or not found...", errno: 400 });
    let retail_price = productInfo.retail_price;
    const [cartInfo] = await cartFindBy({ user_id: userId, product_id: productId, is_delete: 0 });
    const hasCartItem: boolean = cartInfo !== null && cartInfo !== undefined;

    const [tempGoodsSpecificationValue] = hasSpecificationValue
      ? await goodsSpecificationFind({
          select: ["value"],
          where: {
            goods_id: productInfo.goods_id,
            is_delete: 0,
            id: productInfo.goods_specification_ids,
          },
        })
      : [{ value: "" }];
    const goodsSpecificationValue = tempGoodsSpecificationValue.value;

    if (addType === 0) {
      if (hasCartItem) {
        const isOutOfStock: boolean = productInfo.goods_number < number + cartInfo.number;
        if (isOutOfStock) {
          await cartUpdateById(
            { user_id: userId, product_id: productId, is_delete: 0, id: cartInfo.id },
            { retail_price: retail_price, number: productInfo.goods_number }
          );
          return res.json({ errmsg: "Out of stock...", errno: 400 });
        } else {
          await cartUpdateById(
            { user_id: userId, product_id: productId, is_delete: 0, id: cartInfo.id },
            { retail_price: retail_price, number: cartInfo.number + number }
          );
        }
      } else {
        const cartData = {
          goods_id: Number(productInfo.goods_id),
          product_id: productId,
          goods_sn: productInfo.goods_sn,
          goods_name: goodsInfo.name,
          goods_aka: productInfo.goods_name,
          goods_weight: productInfo.goods_weight,
          freight_template_id: goodsInfo.freight_template_id,
          list_pic_url: goodsInfo.list_pic_url,
          number,
          user_id: userId,
          retail_price,
          add_price: retail_price,
          goods_specification_name_value: goodsSpecificationValue,
          goods_specification_ids: productInfo.goods_specification_ids,
          checked: 1,
          add_time: currentTime,
        };
        await cartInsert(cartData);
      }
    } else {
      await cartUpdateById({ user_id: userId, is_delete: 0 }, { checked: 0 });
      if (hasCartItem) {
        await cartUpdateById({ user_id: userId, product_id: productId }, { is_delete: 1 });
      }
      const cartData = {
        goods_id: Number(productInfo.goods_id),
        product_id: productId,
        goods_sn: productInfo.goods_sn,
        goods_name: goodsInfo.name,
        goods_aka: productInfo.goods_name,
        goods_weight: productInfo.goods_weight,
        freight_template_id: goodsInfo.freight_template_id,
        list_pic_url: goodsInfo.list_pic_url,
        number,
        user_id: userId,
        retail_price,
        add_price: retail_price,
        goods_specification_name_value: goodsSpecificationValue,
        goods_specification_ids: productInfo.goods_specification_ids,
        checked: 1,
        add_time: currentTime,
        is_fast: 1,
      };
      await cartInsert(cartData);
      // const cartIndexInfo = await getCartInfoCache(req, 1);
      // return res.send({ data: cartIndexInfo, errmsg: "", errno: 0 });
    }
    const cartIndexInfo = await getCartInfoCache(req, 0);
    return res.send({ data: cartIndexInfo, errmsg: "", errno: 0 });
  } catch (error: any) {
    logger.error(NAMESPACE, error.message, error);
    return res.status(500).json({ errmsg: error.message, errno: 500, error });
  }
};

const getPurcahsedCart = async (
  req: Request,
  res: Response,
  orderFrom: number
): Promise<CartInfoIndex> => {
  let userId = req.user_id;
  try {
    const purchasedGoods = await orderGoodsFind({ where: { order_id: orderFrom } });
    await cartUpdate({ checked: 0 }, { is_delete: 0, user_id: userId });

    await Promise.all(
      purchasedGoods.map(async (orderGoods) => {
        await addPurchasedCartItem(
          req,
          res,
          Number(orderGoods.goods_id),
          Number(orderGoods.product_id),
          orderGoods.number
        );
      })
    );

    const cartList = await cartFind({ where: { user_id: userId, is_fast: 0, is_delete: 0 } });

    await Promise.all(
      cartList.map(async (cart) => {
        const goodsInfo = await goodsFindOne({ where: { id: cart.goods_id } });
        if (goodsInfo) {
          const hasGoods: boolean = goodsInfo.goods_number !== 0;
          if (!hasGoods) {
            await cartUpdate(
              { checked: 0 },
              { product_id: cart.product_id, user_id: userId, checked: 1, is_delete: 0 }
            );
          }
          cart.list_pic_url = goodsInfo.list_pic_url;
          cart.goods_number = goodsInfo.goods_number;
          cart.weight_count = cart.number * Number(cart.goods_weight);
        }
      })
    );

    const goodsCount: number = cartList.reduce((total, cartItem) => total + cartItem.number, 0);
    const goodsAmount = cartList
      .reduce((total, cartItem) => total + cartItem.number * cartItem.retail_price, 0)
      .toFixed(2);

    const checkedCartList = cartList.filter((cart) => cart.checked === 1);
    const checkedGoodsCount = checkedCartList.reduce(
      (total, cartItem) => total + cartItem.number,
      0
    );
    const checkedGoodsAmount = checkedCartList
      .reduce((total, cartItem) => total + cartItem.number * cartItem.retail_price, 0)
      .toFixed(2);

    const cartInfo = {
      cartList,
      cartTotal: {
        goodsCount,
        goodsAmount,
        checkedGoodsCount,
        checkedGoodsAmount,
        user_id: userId,
      },
    };
    return cartInfo;
  } catch (error: any) {
    logger.error(NAMESPACE, error.message, error);
    throw new Error(error);
  }
};

const addPurchasedCartItem = async (
  req: Request,
  res: Response,
  goodsId: number,
  productId: number,
  number: number
) => {
  const currentTime = new Date().getTime() / 1000;
  let userId = req.user_id;

  try {
    // validate if goods exist or not...
    const goodsInfo = await goodsFindOne({ where: { id: goodsId } });
    const isGoodsOnSale: boolean = goodsInfo ? goodsInfo.is_on_sale === 1 : false;
    if (!isGoodsOnSale) return res.status(400).send({ errmsg: "Goods not on sale", errno: 400 });

    // validate if product exist or not...
    const productInfo = await productFindOneBy({ id: productId });
    const isEnoughProductStock: boolean = productInfo ? productInfo.goods_number > number : false;
    if (!isEnoughProductStock)
      return res.status(400).send({ errmsg: "Product is not enough", errno: 400 });
    else {
      // validate if cart has this specific product
      const cartInfo = await cartFindOne({
        where: { user_id: userId, product_id: productId, is_delete: 0 },
      });
      const hasProduct: boolean = cartInfo !== null ? true : false;
      if (hasProduct) {
        // if already has this product, then update item number...

        const isEnoughProductStock: boolean =
          Number(productInfo?.goods_number) > number + Number(cartInfo?.number);
        if (!isEnoughProductStock)
          return res.status(400).send({ errmsg: "not enough stock", errno: 400 });

        await cartUpdateById(String(cartInfo?.id), {
          retail_price: productInfo?.retail_price,
          checked: 1,
          number: number,
        });
      } else {
        // if product is not exist, then add new record...
        let goodsSpecificationValue: any;

        const hasSpecifications: boolean = productInfo
          ? productInfo.goods_specification_ids !== null ||
            productInfo.goods_specification_ids !== undefined
          : false;

        if (hasSpecifications) {
          [goodsSpecificationValue] = await goodsSpecificationFind({
            select: { value: true },
            where: {
              goods_id: goodsId,
              is_delete: 0,
              id: productInfo?.goods_specification_ids,
            },
          });
        }

        const cartData = {
          goods_id: Number(productInfo?.goods_id),
          product_id: productId,
          goods_sn: productInfo?.goods_sn,
          goods_name: goodsInfo?.name,
          goods_aka: productInfo?.goods_name,
          goods_weight: productInfo?.goods_weight,
          freight_template_id: goodsInfo?.freight_template_id,
          list_pic_url: goodsInfo?.list_pic_url,
          number: number,
          user_id: userId,
          retail_price: productInfo?.retail_price,
          add_price: productInfo?.retail_price,
          goods_specification_name_value: goodsSpecificationValue.value,
          goods_specification_ids: productInfo?.goods_specification_ids,
          checked: 1,
          add_time: currentTime,
        };

        await cartInsert(cartData);
      }
    }
  } catch (error: any) {
    logger.error(NAMESPACE, error.message, error);
    return res.status(500).json({ errmsg: error.message, errno: 500, error });
  }
};

const checkoutCartItems = async (req: Request, res: Response) => {
  let { addressId, addType, orderFrom, type, is_pickup } = req.query;
  let userId = req.user_id;

  let goodsCount: number = 0;
  let goodsPrice: number = 0;
  let outStock: number = 0;
  let goodsWeight: number = 0;
  try {
    let cartIndexInfo: CartInfoIndex = { cartList: [] };

    let checkedGoodsList: Cart[] = [];
    if (type === "0") {
      if (addType === "0") cartIndexInfo = await getCartInfoCache(req, 0);
      if (addType === "1") cartIndexInfo = await getCartInfoCache(req, 1);
      if (addType === "2") cartIndexInfo = await getPurcahsedCart(req, res, Number(orderFrom));

      checkedGoodsList = cartIndexInfo.cartList.filter((cart) => cart.checked === 1);

      goodsCount = checkedGoodsList.reduce((total, item) => total + item.number, 0);
      goodsPrice = checkedGoodsList.reduce(
        (total, item) => total + item.number * item.retail_price,
        0
      );
      goodsWeight = checkedGoodsList.reduce(
        (total, item) => total + item.number * item.goods_weight,
        0
      );
      const outStockGoodsList = checkedGoodsList.filter(
        (item) => item.goods_number <= 0 || item.is_on_sale === 0
      );
      const isOutStockGoodsList: boolean = outStockGoodsList.length !== 0;
      if (isOutStockGoodsList) outStock = 1;

      if (addType === "2") {
        const purchasedGoodsList = await orderGoodsFind({ where: { order_id: Number(orderFrom) } });

        const purchasedGoodsCount = purchasedGoodsList.reduce(
          (total, item) => total + item.number,
          0
        );
        // return res.send({ goodsCount, purchasedGoodsCount });
        if (goodsCount !== purchasedGoodsCount) outStock = 1;
      }
    }
    let checkedAddress: any = null;
    const isPickup: boolean = is_pickup === "1";
    const hasAddress: boolean = addressId !== "" && addressId !== "0";
    if (!isPickup) {
      if (!hasAddress) {
        checkedAddress = await addressAUFindOneBy({
          is_default: 1,
          user_id: userId,
          is_delete: 0,
        });
      } else {
        checkedAddress = await addressAUFindOneBy({
          id: String(addressId),
          user_id: userId,
          is_delete: 0,
        });
      }
    } else {
      checkedAddress = await pickupFindOneBy({ id: String(addressId) });
      checkedAddress = { ...checkedAddress, id: checkedAddress?.id };
    }
    console.log("address: ", checkedAddress);

    // total price ...
    let goodsTotalPrice = cartIndexInfo.cartTotal?.checkedGoodsAmount;
    // let freightPrice: number = 0;
    const freightPrice = await calculateFreightPrice(String(checkedAddress?.postcode_id), [
      goodsCount,
      goodsWeight,
    ]);
    freight_price = isPickup ? 0 : freightPrice;
    // console.log("asdasdasdasdasdasdadasdadsasdasdadasdadasdasd", freightPrice);
    let orderTotalPrice = freight_price + Number(cartIndexInfo.cartTotal?.checkedGoodsAmount);
    let numberChange = cartIndexInfo.cartTotal?.numberChange;

    return res.json({
      data: {
        checkedAddress,
        freightPrice: freight_price,
        checkedGoodsList: checkedGoodsList!,
        goodsTotalPrice,
        orderTotalPrice: orderTotalPrice.toFixed(2),
        actualPrice: orderTotalPrice.toFixed(2),
        goodsCount: goodsCount!,
        outStock: outStock,
        numberChange,
        goodsWeight,
      },
      errmsg: "",
      errno: 0,
    });
  } catch (error: any) {
    logger.error(NAMESPACE, error.message, error);
    return res.status(500).json({ errmsg: error.message, errno: 500 });
  }
};

const calculateFreightPrice = async (postcodeId: string, goodsNumberOrGoodsWeight: number[]) => {
  const freightTemplateList = await freightTemplateFindBy({ is_delete: 0 });
  const freightTemplateIdArray = freightTemplateList.map((item) => item.id);
  // console.log(freightTemplateIdArray);
  // const isInRange: boolean =

  const [freightGroupList] = await Promise.all(
    freightTemplateIdArray.map(async (id) => {
      const freightGroup = await freightTemplateGroupFindBy({ template_id: id, is_delete: 0 });
      // console.log(freightGroup.area);
      return freightGroup;
    })
  );

  const [currentFreightTemplateGroup] = await Promise.all(
    freightGroupList.filter(async (item) => {
      const [postcodeItem] = await postcodeFindBy({ state: "VIC", id: postcodeId });
      if (postcodeItem) {
        item.area = item.area.split(",");
        if (item.area.includes(postcodeItem.sa3)) return item;
      }
    })
  );

  logger.debug(NAMESPACE, "currentFreightTemplateGroup: ", currentFreightTemplateGroup);
  if (currentFreightTemplateGroup === null || currentFreightTemplateGroup === undefined) return 0;

  const [currentFreightTemplate] = await freightTemplateFindBy({
    id: currentFreightTemplateGroup.template_id,
  });

  const freightType = currentFreightTemplate.freight_type;
  const package_price = Number(currentFreightTemplate.package_price);
  const numberOrWeight: number =
    freightType === 0 ? goodsNumberOrGoodsWeight[0] : goodsNumberOrGoodsWeight[1];
  console.log(goodsNumberOrGoodsWeight);

  if (currentFreightTemplateGroup.start === 0) {
    const freightFee = Math.ceil(
      (numberOrWeight / currentFreightTemplateGroup.add) * currentFreightTemplateGroup.add_fee
    );
    return freightFee + package_price;
  } else {
    if (numberOrWeight <= currentFreightTemplateGroup.start) {
      return (
        package_price +
        Math.ceil(currentFreightTemplateGroup.start * currentFreightTemplateGroup.start_fee)
      );
    } else {
      const freightStartFee = Math.ceil(
        currentFreightTemplateGroup.start * currentFreightTemplateGroup.start_fee
      );

      const freightFee = Math.ceil(
        ((numberOrWeight - currentFreightTemplateGroup.start) / currentFreightTemplateGroup.add) *
          currentFreightTemplateGroup.add_fee
      );
      // console.log("package fee: ", typeof package_price);
      return package_price + freightFee + freightStartFee;
    }
  }
};

export default {
  getCartIndexInfo,
  getGoodsCount,
  updateCartCheckedStatus,
  updateCartGoodsNumber,
  deleteCartItem,
  addCartItem,
  checkoutCartItems,
};
