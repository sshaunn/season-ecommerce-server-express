import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

import User from "./user.entity";

@Entity({ name: "season_cart" })
class Cart {
  @PrimaryGeneratedColumn("increment")
  id: number | string;

  @Column({ type: "mediumint", width: 8, default: 0 })
  //   @ManyToOne((type) => User)
  user_id: number;

  @Column({ type: "mediumint", width: 8, default: 0 })
  goods_id: number;

  @Column({ type: "varchar", length: 60, default: "" })
  goods_sn: string;

  @Column({ type: "mediumint", width: 8, default: 0 })
  product_id: number;

  @Column({ type: "varchar", length: 120, default: "" })
  goods_name: string;

  @Column({ type: "varchar", length: 120, default: "" })
  goods_aka: string;

  @Column({
    type: "double",
    precision: 4,
    scale: 2,
    default: 0.0,
    comment: "重量",
  })
  goods_weight: number;

  @Column({
    type: "decimal",
    precision: 10,
    scale: 2,
    default: 0.0,
    comment: "加入购物车时的价格",
  })
  add_price: number;

  @Column({ type: "decimal", precision: 10, scale: 2, default: 0.0 })
  retail_price: number;

  @Column({ type: "smallint", width: 5, default: 0 })
  number: number;

  @Column("text")
  goods_specification_name_value: string;

  @Column({ type: "varchar", length: 60, default: "" })
  goods_specification_ids: any;

  @Column({ type: "tinyint", width: 1, default: 1 })
  checked: number | boolean;

  @Column({ type: "varchar", length: 255, default: "" })
  list_pic_url: string;

  @Column({ type: "mediumint", width: 4 })
  freight_template_id: number;

  @Column({ type: "tinyint", width: 1, default: 1 })
  is_on_sale: number;

  @Column({ type: "int", width: 11, default: 0 })
  add_time: number | string;

  @Column({ type: "tinyint", width: 1, default: 0 })
  is_fast: number | boolean;

  @Column({ type: "tinyint", width: 2, default: 0 })
  is_delete: number;

  @ManyToOne(() => User, (user) => user.nickname)
  @JoinColumn([{ name: "user_id", referencedColumnName: "id" }])
  user: User;
  nickname?: string;
  weight_count?: number | string;
  goods_number!: number;
}

export default Cart;
