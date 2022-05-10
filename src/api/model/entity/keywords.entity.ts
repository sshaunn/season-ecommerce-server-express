import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: "season_keywords" })
class Keywords {
  @PrimaryGeneratedColumn("increment")
  id: string | number;

  @Column({ type: "varchar", length: 90, default: "" })
  keyword: string;

  @Column({ type: "tinyint", width: 1, default: 0, unsigned: true })
  is_hot: number | boolean;

  @Column({ type: "tinyint", width: 1, default: 0, unsigned: true })
  is_default: number | boolean;

  @Column({ type: "tinyint", width: 1, default: 0, unsigned: true })
  is_show: number | boolean;

  @Column({ type: "int", width: 11, default: 100, unsigned: true })
  sort_order: number;

  @Column({ type: "varchar", length: 255, default: "" })
  scheme_url: string;

  @Column({ type: "int", width: 11, default: 0, unsigned: true })
  type: number;
}

export default Keywords;
