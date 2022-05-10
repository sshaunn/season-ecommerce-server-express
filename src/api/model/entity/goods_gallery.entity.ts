import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: "season_goods_gallery" })
class GoodsGallery {
  @PrimaryGeneratedColumn("increment")
  id: number | string;

  @Column({ type: "int", width: 11, default: 0 })
  goods_id: number | string;

  @Column({ type: "varchar", length: 255, default: "" })
  img_url: string;
  url?: string;

  @Column({ type: "varchar", length: 255, default: "" })
  img_desc: string;

  @Column({ type: "int", width: 11, default: 0 })
  sort_order: number;

  @Column({ type: "tinyint", width: 1, default: 0 })
  is_delete: number;
}

export default GoodsGallery;
