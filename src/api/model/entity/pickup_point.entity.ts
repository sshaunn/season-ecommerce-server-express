import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity({ name: "season_pickup_point" })
class PickupPoint {
  @PrimaryGeneratedColumn("increment")
  id: number | string;

  @Column({ type: "varchar", length: 255, default: "" })
  address: string;

  @Column({ type: "varchar", length: 255, default: "" })
  postcode: string;

  @Column({ type: "varchar", length: 255, default: "" })
  suburb: string;

  @Column({ type: "varchar", length: 255, default: "" })
  region: string;

  @Column({ type: "varchar", length: 255, default: "" })
  state: string;

  @Column({ type: "tinyint", width: 1, default: 0 })
  is_delete: number;
}

export default PickupPoint;
