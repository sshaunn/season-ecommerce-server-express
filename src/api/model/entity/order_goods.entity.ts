import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import Order from "./order.entity";
import OrderAU from "./order_au.entity";

@Entity({ name: "season_order_goods" })
class OrderGoods {
  @PrimaryGeneratedColumn("increment")
  id: number | string;

  @Column({ type: "mediumint", width: 8, default: 0 })
  order_id: number | string;

  @Column({ type: "mediumint", width: 8, default: 0 })
  goods_id: number | string;

  @Column({ type: "varchar", length: 120, default: "" })
  goods_name: string;

  @Column({ type: "varchar", length: 120, default: "" })
  goods_aka: string;

  @Column({ type: "mediumint", width: 8, default: 0 })
  product_id: number | string;

  @Column({ type: "smallint", width: 5, default: 0 })
  number: number;

  @Column({ type: "decimal", precision: 10, scale: 2, default: 0.0 })
  retail_price: number | string;

  @Column("text")
  goods_specification_name_value: string;

  @Column({ type: "varchar", length: 255, default: "" })
  goods_specification_ids: string;

  @Column({ type: "varchar", length: 255, default: "" })
  list_pic_url: string;

  @Column({ type: "mediumint", width: 8, default: 0 })
  user_id: number | string;

  @Column({ type: "tinyint", width: 1, default: 0 })
  is_delete: number | string;

  @ManyToOne(() => Order, (order) => order.orderGoods)
  @JoinColumn({ name: "order_id", referencedColumnName: "id" })
  order: Order;

  @ManyToOne(() => OrderAU, (orderAU) => orderAU.orderGoods)
  @JoinColumn({ name: "order_id", referencedColumnName: "id" })
  orderAu: OrderAU;
}

export default OrderGoods;
