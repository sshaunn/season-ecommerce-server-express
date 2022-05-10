import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  Tree,
  TreeParent,
  TreeChildren,
} from "typeorm";
import Goods from "./goods.entity";

@Entity({ name: "season_category" })
// @Tree("nested-set")
class Category {
  @PrimaryGeneratedColumn("increment")
  id: number;
  value!: number;

  @Column({ type: "varchar", length: 90, default: "" })
  name: string;
  label!: string;

  @Column({ type: "varchar", length: 255, default: "" })
  keywords: string;

  @Column({ type: "varchar", length: 255, default: "" })
  front_desc: string;

  @Column({ type: "int", width: 11, default: 0 })
  parent_id: number;

  @Column({ type: "tinyint", default: 50 })
  sort_order: number;

  @Column({ type: "tinyint", default: 0 })
  show_index: number;

  @Column({ type: "tinyint", default: 1 })
  is_show: number | boolean;

  @Column({ type: "varchar", length: 255 })
  icon_url: string;

  @Column({ type: "varchar", length: 255 })
  img_url: string;

  @Column({ type: "varchar", length: 255 })
  level: string | number;

  @Column({ type: "varchar", length: 255 })
  front_name: string;

  @Column({ type: "int", width: 3, default: 0 })
  p_height: number;

  @Column({ type: "tinyint", default: 1 })
  is_category: number | boolean;

  @Column({ type: "tinyint", default: 1 })
  is_channel: number | boolean;

  @OneToMany(() => Goods, (goods) => goods.category)
  goods: Goods[];

  // @TreeParent()
  parent!: Category;
  // @TreeChildren()
  childs!: Category[];
  children!: Category[];
}

export default Category;
