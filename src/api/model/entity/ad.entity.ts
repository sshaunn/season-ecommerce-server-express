import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: "season_ad" })
class Ad {
  @PrimaryGeneratedColumn("increment")
  id: number | string;

  @Column({ type: "tinyint", width: 1, default: 0 })
  link_type: number;

  @Column({ type: "varchar", length: 255, default: "" })
  link: string;

  @Column({ type: "int", width: 11, default: 0 })
  goods_id: number | string;

  @Column("text")
  image_url: string;

  @Column({ type: "int", width: 11, default: 0 })
  end_time: number | string;

  @Column({ type: "tinyint", width: 1, unsigned: true, default: 0 })
  enabled: number | boolean;

  @Column({ type: "tinyint", width: 2, default: 0 })
  sort_order: number | string;

  @Column({ type: "tinyint", width: 1, default: 0 })
  is_delete: number | boolean;
}

export default Ad;
