import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToOne, JoinColumn } from "typeorm";
import OrderGoods from "./order_goods.entity";
import User from "./user.entity";

@Entity({ name: "season_order" })
class Order {
  @PrimaryGeneratedColumn("increment")
  id: number | string;

  @Column({ type: "varchar", length: 20, default: "" })
  order_sn: string;

  @Column({ type: "mediumint", width: 8, default: 0 })
  user_id: number;

  @Column({
    type: "smallint",
    width: 4,
    default: 0,
    comment:
      "101：未付款、102：已取消、103已取消(系统)、201：已付款、202：订单取消，退款中、203：已退款、301：已发货、302：已收货、303：已收货(系统)、401：已完成、801：拼团中,未付款、802：拼团中,已付款",
  })
  order_status: number;

  @Column({ type: "tinyint", width: 1, default: 0 })
  offline_pay: number;

  @Column({
    type: "tinyint",
    width: 1,
    default: 0,
    comment: "0未发货，1已发货",
  })
  shipping_status: number;

  @Column({ type: "tinyint", width: 1, default: 0 })
  print_status: number;

  @Column({ type: "tinyint", width: 1, default: 0 })
  pay_status: number;

  @Column({ type: "varchar", length: 60, default: "" })
  consignee: string;

  @Column({ type: "smallint", width: 5, default: 0 })
  country: number;

  @Column({ type: "smallint", width: 5, default: 0 })
  province: number;

  @Column({ type: "smallint", width: 5, default: 0 })
  city: number;

  @Column({ type: "smallint", width: 5, default: 0 })
  district: number;

  @Column({ type: "varchar", length: 255, default: "" })
  address: string;

  @Column({ type: "varchar", length: 255, default: "" })
  print_info: string;

  @Column({ type: "varchar", length: 60, default: "" })
  mobile: string;

  @Column({ type: "varchar", length: 255, default: "" })
  postscript: string;

  @Column({ type: "varchar", length: 255, default: "" })
  admin_memo: string;

  @Column({
    type: "decimal",
    precision: 10,
    scale: 2,
    default: 0.0,
    comment: "免邮的商品的邮费，这个在退款时不能退给客户",
  })
  shipping_fee: number;

  @Column({ type: "varchar", length: 255, default: "" })
  pay_name: string;

  @Column({ type: "varchar", length: 255, default: "" })
  pay_id: string;

  @Column({
    type: "decimal",
    precision: 10,
    scale: 2,
    default: 0.0,
    comment: "0没改价，不等于0改过价格，这里记录原始的价格",
  })
  change_price: number;

  @Column({
    type: "decimal",
    precision: 10,
    scale: 2,
    default: 0.0,
    comment: "实际需要支付的金额",
  })
  actual_price: number;

  @Column({
    type: "decimal",
    precision: 10,
    scale: 2,
    default: 0.0,
    comment: "订单总价",
  })
  order_price: number;

  @Column({ type: "decimal", precision: 10, scale: 2, comment: "商品总价" })
  goods_price: number;

  @Column({ type: "int", width: 11, default: 0 })
  add_time: number | string;

  @Column({ type: "int", width: 11, default: 0, comment: "付款时间" })
  pay_time: number;

  @Column({ type: "int", width: 11, default: 0, comment: "发货时间" })
  shipping_time: number;

  @Column({ type: "int", width: 11, default: 0, comment: "确认时间" })
  confirm_time: number;

  @Column({
    type: "int",
    width: 11,
    default: 0,
    comment: "成交时间，用户评论或自动好评时间",
  })
  dealdone_time: number;

  @Column({ type: "int", width: 10, default: 0, comment: "配送费用" })
  freight_price: number;

  @Column({
    type: "decimal",
    precision: 10,
    scale: 2,
    default: 480.0,
    comment: "顺丰保价金额",
  })
  express_value: number;

  @Column({
    type: "varchar",
    length: 255,
    default: "需电联客户请优先派送勿放快递柜",
  })
  remark: string;

  @Column({
    type: "tinyint",
    width: 2,
    default: 0,
    comment: "订单类型：0普通，1秒杀，2团购，3返现订单,7充值，8会员",
  })
  order_type: number;

  @Column({ type: "tinyint", width: 1, default: 0, comment: "订单删除标志" })
  is_delete: number;

  goodsCount?: number;

  @OneToMany(() => OrderGoods, (orderGoods) => orderGoods.order)
  orderGoods: OrderGoods[];

  @ManyToOne(() => User, (userInfo) => userInfo.orders)
  @JoinColumn({ name: "user_id", referencedColumnName: "id" })
  userInfo: User;
}

export default Order;
