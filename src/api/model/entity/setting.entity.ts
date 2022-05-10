import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinTable } from "typeorm";
import Goods from "./goods.entity";
// import Order from "./order.entity";

@Entity({ name: "season_settings" })
class Settings {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @Column({ type: "tinyint", width: 1, default: 0 })
  autoDelivery: number;

  @Column({ type: "varchar", length: 100 })
  Name: string;

  @Column({ type: "varchar", length: 20 })
  Tel: string;

  @Column({ type: "varchar", length: 20 })
  ProvinceName: string;

  @Column({ type: "varchar", length: 20 })
  CityName: string;

  @Column({ type: "varchar", length: 20 })
  ExpAreaName: string;

  @Column({ type: "varchar", length: 20 })
  Address: string;

  @Column({ type: "int", width: 4, default: 0 })
  discovery_img_height: number;

  @Column({ type: "varchar", length: 255, default: "" })
  discovery_img: string;

  @Column({ type: "int", width: 11, default: 0 })
  goods_id: number;

  @Column({ type: "int", width: 5, default: 0 })
  city_id: number;

  @Column({ type: "int", width: 5, default: 0 })
  province_id: number;

  @Column({ type: "int", width: 5, default: 0 })
  district_id: number;

  @Column({ type: "int", width: 11, default: 0, comment: "10分钟倒计时" })
  countdown: number;

  @Column({ type: "tinyint", width: 1, default: 0 })
  reset: number;

  @OneToOne((type) => Goods, { cascade: true })
  @JoinTable({
    name: "season_goods",
    joinColumn: { name: "goods_id", referencedColumnName: "id" },
  })
  goods: Goods;

  //   @OneToOne((type) => Order, { cascade: ["update"] })
  //   @JoinTable({ name: "season_order", joinColumns:[{
  //       name: ''
  //   }] })
  //   order: Order;
}

export default Settings;
