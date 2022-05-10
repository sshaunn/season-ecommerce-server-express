import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import Goods from "./goods.entity";

@Entity({ name: "season_footprint" })
class Footprint {
  @PrimaryGeneratedColumn("increment")
  id: number | string;

  @Column({ type: "int", width: 11, default: 0 })
  user_id: number | string;

  @JoinColumn({ name: "goods_id", referencedColumnName: "id" })
  @Column({ type: "int", width: 11, default: 0 })
  goods_id: number | string;

  @Column({ type: "int", width: 11, default: 0 })
  add_time: number | string;

  @ManyToOne(() => Goods, (goods) => goods.footprint)
  // @JoinTable({ name: "season_goods" })
  @JoinColumn({ name: "goods_id", referencedColumnName: "id" })
  goods: Goods;
}

export default Footprint;
