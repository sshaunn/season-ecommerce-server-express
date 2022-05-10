import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import OrderGoods from "./order_goods.entity";
import User from "./user.entity";

@Entity({ name: "season_order_au" })
class OrderAU {
  @PrimaryGeneratedColumn("increment")
  id: number | string;

  @Column({ type: "decimal", precision: 20, scale: 0, default: 0 })
  create_time!: number | string;

  @Column({ type: "decimal", precision: 20, scale: 0, default: 0 })
  pay_time!: number | string | null;

  @Column({ type: "decimal", precision: 20, scale: 0, default: 0 })
  confirm_time!: number | string | null;

  @Column({ type: "decimal", precision: 20, scale: 0, default: 0 })
  finish_time!: number | string | null;

  @Column({ type: "tinyint", width: 1, default: 0 })
  order_type: number | boolean;

  @Column({ type: "int", width: 11, default: 0 })
  user_id: number | string;

  @Column({ type: "varchar", length: 255, default: "" })
  postscript: string;

  @Column({ type: "varchar", length: 255, default: "" })
  admin_memo: string;

  @Column({ type: "int", width: 11, default: 0 })
  order_status: number | string;

  @Column({ type: "tinyint", width: 1, default: 0 })
  offline_pay: number | boolean;

  @Column({ type: "int", width: 11, default: 0 })
  payment_method: number | string;

  @Column({ type: "varchar", length: 255, default: "" })
  transfer_screenshot_url: string;

  @Column({ type: "tinyint", width: 1, default: 0 })
  pay_status: number | string;

  @Column({ type: "tinyint", width: 1, default: 0 })
  print_status: number | string;

  @Column({ type: "tinyint", width: 1, default: 0 })
  is_pickup: number | boolean;

  @Column({ type: "varchar", length: 255, default: "" })
  delivery_contact_name: string;

  @Column({ type: "varchar", length: 255, default: "" })
  delivery_contact_number: string;

  @Column({ type: "varchar", length: 255, default: "" })
  delivery_address: string;

  @Column({ type: "varchar", length: 255, default: "" })
  delivery_postcode: string | number | undefined;

  @Column({ type: "varchar", length: 255, default: "" })
  delivery_suburb: string;

  @Column({ type: "varchar", length: 255, default: "" })
  pickup_address: string;

  @Column({ type: "varchar", length: 255, default: "" })
  pickup_postcode: string | number | undefined;

  @Column({ type: "varchar", length: 255, default: "" })
  pickup_suburb: string;

  @Column({ type: "decimal", precision: 10, scale: 2, default: 0.0 })
  freight_price: number;

  @Column({ type: "varchar", length: 255, default: "" })
  paylinx_transaction_id: string;

  @Column({ type: "decimal", precision: 10, scale: 2, default: 0.0 })
  total_price: number;

  @Column({ type: "decimal", precision: 10, scale: 2, default: 0.0 })
  changed_total_price: number;

  @Column({ type: "tinyint", width: 1, default: 0 })
  is_delete: number | boolean;

  @Column({ type: "varchar", length: 20, default: "" })
  order_sn: number | string;

  @OneToMany(() => OrderGoods, (orderGoods) => orderGoods.orderAu)
  orderGoods: OrderGoods[];

  @ManyToOne(() => User, (userInfo) => userInfo.orderAUs)
  @JoinColumn({ name: "user_id", referencedColumnName: "id" })
  userInfo: User;

  goodsCount!: number;

  full_address!: string;
  order_status_text!: string;
  button_text!: string;
}
export default OrderAU;
