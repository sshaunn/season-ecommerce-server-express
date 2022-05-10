import Cart from "../model/entity/cart.entity";
interface cartTotal {
  goodsCount: number;
  goodsAmount: number | string;
  checkedGoodsCount: number;
  checkedGoodsAmount: number | string;
  user_id: any;
  numberChange?: number;
}

export interface CartInfoIndex {
  cartList: Cart[];
  cartTotal?: cartTotal;
}

export interface CartInfoData {
  goods_id: number | string;
  product_id: number | string;
  goods_sn: number | string;
  goods_name: string;
  goods_aka: string;
  goods_weight: number;
  freight_template_id: number | string;
  list_pic_url: string;
  number: number;
  user_id: number | string;
  retail_price: number | string;
  add_price: number | string;
  goods_specification_name_value: string;
  goods_specification_ids: number | string | number[] | string[];
  checked: number;
  add_time: number;
  is_fast?: number;
  add_time: number;
}
