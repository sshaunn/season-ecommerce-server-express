import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: "season_freight_template_group" })
class FreightTemplateGroup {
  @PrimaryGeneratedColumn("increment")
  id: number | string;

  @Column({ type: "int", width: 11, default: 0 })
  template_id: number | string;

  @Column({ type: "tinyint", width: 1, default: 0 })
  is_default: number;

  @Column({ type: "varchar", length: 3000, default: 0 })
  area: string | string[] | number[] | any;
  areaName!: string;

  @Column({ type: "int", width: 3, default: 1 })
  start: number;

  @Column({ type: "decimal", precision: 10, scale: 2, default: 0.0 })
  start_fee: number;

  @Column({ type: "int", width: 3, default: 1 })
  add: number;

  @Column({ type: "decimal", precision: 10, scale: 2, default: 0.0 })
  add_fee: number;

  @Column({ type: "tinyint", width: 1, default: 0 })
  free_by_number: number;
  freeByNumber!: boolean | number;

  @Column({ type: "decimal", precision: 10, scale: 2, default: 0.0 })
  free_by_money: number;
  freeByMoney!: number | boolean;

  @Column({ type: "tinyint", width: 1, default: 0 })
  is_delete: number | boolean;
}

export default FreightTemplateGroup;
