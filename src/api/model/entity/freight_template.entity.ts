import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: "season_freight_template" })
class FreightTemplate {
  @PrimaryGeneratedColumn("increment")
  id: number | string;

  @Column({ type: "varchar", length: 120, default: "" })
  name: string;

  @Column({ type: "decimal", precision: 5, scale: 2, default: 0.0 })
  package_price: number;

  @Column({ type: "tinyint", width: 1, default: 0 })
  freight_type: number | string;

  @Column({ type: "tinyint", width: 1, default: 0 })
  is_delete: number;
}

export default FreightTemplate;
