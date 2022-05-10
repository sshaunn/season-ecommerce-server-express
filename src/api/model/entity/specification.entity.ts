import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: "season_specification" })
class Specification {
  @PrimaryGeneratedColumn("increment")
  id: number | string;

  @Column({ type: "varchar", length: 60, default: "" })
  name: string;

  @Column({ type: "tinyint", width: 3, default: 0 })
  sort_order: number;

  @Column({ type: "varchar", length: 255, default: "0", comment: "说明" })
  memo: string;
}

export default Specification;
