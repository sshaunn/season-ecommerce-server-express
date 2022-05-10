import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import User from "./user.entity";

@Entity({ name: "season_address_au" })
class AddressAU {
  @PrimaryGeneratedColumn("increment")
  id: number | string;

  @Column({ type: "mediumint", width: 8, default: 0 })
  user_id: number | string;

  @Column({ type: "int", width: 11, default: 0 })
  postcode_id: number | string;

  @Column({ type: "varchar", length: 255, default: "" })
  postcode: string | number;

  @Column({ type: "varchar", length: 255, default: "" })
  street: string;

  @Column({ type: "varchar", length: 255, default: "" })
  suburb: string;

  @Column({ type: "varchar", length: 255, default: "" })
  state: string;

  @Column({ type: "varchar", length: 255, default: "" })
  contact_name: string;
  name?: string;

  @Column({ type: "varchar", length: 50, default: "" })
  contact_number: string | number;
  mobile?: string | number;

  @Column({ type: "tinyint", width: 1, default: 0 })
  is_delete: number | boolean;

  @Column({ type: "tinyint", width: 1, default: 0 })
  is_default: number | boolean;

  full_region!: string;

  @ManyToOne(() => User, (userInfo) => userInfo.addressesAu)
  @JoinColumn({ name: "user_id", referencedColumnName: "id" })
  userInfo: User;
}

export default AddressAU;
