import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: "season_freight_template_detail" })
class FreightTemplateDetail {
  @PrimaryGeneratedColumn("increment")
  id: number | string;

  @Column({ type: "int", width: 11, default: 0 })
  template_id: number | string;

  @Column({ type: "int", width: 11, default: 0 })
  group_id: number | string;

  @Column({ type: "int", width: 5, default: 0 })
  area: number | string;

  @Column({ type: "tinyint", width: 1, default: 0 })
  is_delete: number | boolean;
}

export default FreightTemplateDetail;
