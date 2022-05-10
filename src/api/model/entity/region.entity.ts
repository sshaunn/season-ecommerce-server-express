import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: "season_region" })
class Region {
  @PrimaryGeneratedColumn("increment")
  id: number | string;

  @Column({ type: "smallint", width: 5, default: 0 })
  parent_id: number;

  @Column({ type: "varchar", length: 120, default: "" })
  name: string;

  @Column({ type: "tinyint", width: 1, default: 2 })
  type: number;

  @Column({ type: "smallint", width: 5, default: 0 })
  agency_id: number | string;

  @Column({ type: "smallint", width: 5, default: 0 })
  area: number | string;

  @Column({ type: "varchar", length: 10, default: 0, charset: "utf8" })
  area_code: string;

  @Column({ type: "int", width: 2, default: 0 })
  far_area: number | string;
}

export default Region;
