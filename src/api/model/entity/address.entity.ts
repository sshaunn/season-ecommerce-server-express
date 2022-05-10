import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: "season_address" })
class Address {
  @PrimaryGeneratedColumn("increment")
  id: number | string;

  @Column({ type: "varchar", length: 50, default: "" })
  name: string;

  @Column({ type: "mediumint", width: 8, default: 0 })
  user_id: number | string;

  @Column({ type: "smallint", width: 5, default: 0 })
  country_id: number | string;

  @Column({ type: "smallint", width: 5, default: 0 })
  province_id: number | string;

  @Column({ type: "smallint", width: 5, default: 0 })
  city_id: number | string;

  @Column({ type: "smallint", width: 5, default: 0 })
  district_id: number | string;

  @Column({ type: "varchar", length: 120, default: "" })
  address: string;

  @Column({ type: "varchar", length: 60, default: 0 })
  mobile: string;

  @Column({ type: "tinyint", width: 1, default: 0, unsigned: true })
  is_default: number;

  @Column({ type: "tinyint", width: 1, default: 0 })
  is_delete: number;
}

export default Address;
