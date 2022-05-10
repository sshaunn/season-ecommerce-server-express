import { Entity, Column, PrimaryGeneratedColumn, OneToMany, JoinColumn } from "typeorm";
import AddressAU from "./address_au.entity";
import Cart from "./cart.entity";
import Order from "./order.entity";
import OrderAU from "./order_au.entity";

@Entity({ name: "season_user" })
class User {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @Column({ type: "varchar", length: 1024 })
  nickname: string;

  @Column({ type: "varchar", length: 60, default: "" })
  name: string;

  @Column({ type: "varchar", length: 60, default: "" })
  username: string;

  @Column({ type: "varchar", length: 32, default: "" })
  password: string;

  @Column({ type: "tinyint", width: 1, default: 0 })
  gender: number;

  @Column({ type: "int", width: 11, default: 0 })
  birthday: number;

  @Column({ type: "int", width: 11, default: 0 })
  register_time: number | string;

  @Column({ type: "int", width: 11, default: 0 })
  last_login_time: number | string;

  @Column({ type: "varchar", length: 15, default: "" })
  last_login_ip: string;

  @Column({ type: "varchar", length: 20, default: "" })
  mobile: string;

  @Column({ type: "varchar", length: 45, default: "" })
  register_ip: string;

  @Column({ type: "varchar", length: 255, default: "" })
  avatar: string;

  @Column({ type: "varchar", length: 50, default: "" })
  weixin_openid: string;

  @Column({ type: "tinyint", width: 1, default: 0 })
  name_mobile: number;

  @Column({ type: "varchar", length: 255, default: "" })
  country: string;

  @Column({ type: "varchar", length: 100, default: "" })
  province: string;

  @Column({ type: "varchar", length: 100, default: "" })
  city: string;

  @OneToMany(() => Cart, (cart) => cart.user_id)
  carts: Cart[];

  @OneToMany(() => Order, (orders) => orders.userInfo)
  orders: Order[];

  @OneToMany(() => OrderAU, (orderAUs) => orderAUs.userInfo)
  orderAUs: Order[];

  @OneToMany(() => AddressAU, (addressesAU) => addressesAU.userInfo)
  addressesAu: AddressAU[];
}

export default User;
