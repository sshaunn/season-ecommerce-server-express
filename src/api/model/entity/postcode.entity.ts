import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: "season_postcodes" })
class Postcodes {
  @PrimaryGeneratedColumn("increment")
  id: number | string;

  @Column({ type: "varchar", length: 255, default: "" })
  postcode: string | number;

  @Column({ type: "varchar", length: 255, default: "" })
  locality: string;

  @Column({ type: "varchar", length: 255, default: "" })
  state: string;

  @Column({ type: "varchar", length: 255, default: "" })
  dc: string;

  @Column({ type: "varchar", length: 255, default: "" })
  type: string;

  @Column({ type: "varchar", length: 255, default: "" })
  long: string;

  @Column({ type: "varchar", length: 255, default: "" })
  lat: string;

  @Column({ type: "varchar", length: 255, default: "" })
  sa3: string;

  @Column({ type: "varchar", length: 255, default: "" })
  sa3name: string;

  @Column({ type: "varchar", length: 255, default: "" })
  sa4: string;

  @Column({ type: "varchar", length: 255, default: "" })
  sa4name: string;

  @Column({ type: "varchar", length: 255, default: "" })
  region: string;

  @Column({ type: "tinyint", width: 1, default: "" })
  is_delivery: number | boolean;
}

export default Postcodes;
