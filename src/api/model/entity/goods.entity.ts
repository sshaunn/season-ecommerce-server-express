import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  JoinTable,
  OneToMany,
} from "typeorm";
import Category from "./category.entity";
import Footprint from "./footprint.entity";
import Product from "./product.entity";

@Entity({ name: "season_goods" })
class Goods {
  @PrimaryGeneratedColumn("increment")
  id?: number | string;

  @Column({ type: "int", width: 11, default: 0 })
  category_id: number;

  @Column({ type: "int", width: 11, default: 0 })
  sub_category_id: number | string;

  @Column({ type: "tinyint", width: 1, default: 0 })
  is_on_sale: number | boolean;

  @Column({ type: "varchar", length: 120, default: "" })
  name: string;

  @Column({ type: "mediumint", width: 8, default: 0 })
  goods_number: number;

  @Column({ type: "int", width: 11, default: 0, comment: "销售量" })
  sell_volume: number;

  @Column({ type: "varchar", length: 255, default: 0 })
  keywords: string;

  @Column({ type: "varchar", length: 100, default: "0.00", comment: "零售价" })
  retail_price: string | number;

  @Column({ type: "decimal", precision: 10, scale: 2, default: 0.0 })
  min_retail_price: number;

  @Column({ type: "varchar", length: 100, default: "0.00" })
  cost_price: string | number;

  @Column({ type: "decimal", precision: 10, scale: 2, default: 0.0 })
  min_cost_price: number;

  @Column({ type: "varchar", length: 255, default: "" })
  goods_brief: string;

  @Column("text")
  goods_desc: string;

  @Column({ type: "smallint", width: 4, default: 100 })
  sort_order: number;

  @Column({ type: "tinyint", width: 1, default: 0 })
  is_index: number | boolean;

  @Column({ type: "tinyint", width: 1, default: 0 })
  is_new: number;

  @Column({ type: "varchar", length: 45, comment: "商品单位" })
  goods_unit: string;

  @Column({ type: "varchar", length: 255, default: "", comment: "商品https图" })
  https_pic_url: string;

  @Column({ type: "varchar", length: 255, comment: "商品列表图" })
  list_pic_url: string;

  @Column({ type: "int", width: 5, default: 0 })
  freight_template_id: number;

  @Column({ type: "tinyint", width: 1, default: 0 })
  freight_type: number;

  @Column({ type: "tinyint", width: 1, default: 0 })
  is_delete: number;

  @OneToMany(() => Footprint, (footprint) => footprint.goods)
  // @JoinTable()
  footprint: Footprint[];

  @ManyToOne(() => Category, (category) => category.goods)
  @JoinColumn({ name: "category_id", referencedColumnName: "id" })
  category: Category;

  @OneToMany(() => Product, (product) => product.goods)
  products: Product[];
}

export default Goods;
