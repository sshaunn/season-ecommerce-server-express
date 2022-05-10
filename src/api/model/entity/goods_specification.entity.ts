import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: "season_goods_specification" })
class GoodsSpecification {
  @PrimaryGeneratedColumn("increment")
  id: string | number;

  @Column({ type: "int", width: 11, default: 0 })
  goods_id: number | string;

  @Column({ type: "int", width: 11, default: 0 })
  specification_id: number | string;

  @Column({ type: "varchar", length: 50, default: "" })
  value: string;

  @Column({ type: "varchar", length: 255, default: "" })
  pic_url: string;

  @Column({ type: "tinyint", width: 1, default: 0 })
  is_delete: number;

  goods_number!: number;
}

export default GoodsSpecification;
