import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import Goods from "./goods.entity";

@Entity({ name: "season_product" })
class Product {
  @PrimaryGeneratedColumn("increment")
  id: number | string;

  @Column({ type: "mediumint", width: 8, default: 0, unsigned: true })
  goods_id: number | string;

  @Column({ type: "varchar", length: 50, default: "" })
  goods_specification_ids: any;

  @Column({ type: "varchar", width: 60, default: "" })
  goods_sn: string;

  @Column({ type: "mediumint", width: 8, default: 0 })
  goods_number: number;

  @Column({ type: "decimal", precision: 10, scale: 2, default: 0.0 })
  retail_price: number;

  @Column({ type: "decimal", precision: 10, scale: 2, default: 0.0 })
  cost: number;

  @Column({ type: "double", precision: 6, scale: 2, default: 0.0 })
  goods_weight: number;

  @Column({ type: "tinyint", width: 1, default: 0 })
  has_change: number;

  @Column({ type: "varchar", length: 120, default: "" })
  goods_name: string;

  @Column({ type: "tinyint", width: 1, default: 1 })
  is_on_sale: number;

  @Column({ type: "tinyint", width: 1, default: 0 })
  is_delete: number;

  @ManyToOne(() => Goods, (goods) => goods.products)
  @JoinColumn({ name: "goods_id", referencedColumnName: "id" })
  goods: Goods;

  value?: string;
}

export default Product;
