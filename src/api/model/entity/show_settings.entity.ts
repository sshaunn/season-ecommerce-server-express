import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: "season_show_settings" })
class ShowSettings {
  @PrimaryGeneratedColumn("increment")
  id: number | string;

  @Column({ type: "tinyint", width: 1, default: 0, unsigned: true })
  banner: number | boolean;

  @Column({ type: "tinyint", width: 1, default: 0 })
  channel: number | boolean;

  @Column({ type: "tinyint", width: 1, default: 0 })
  index_banner_img: number | boolean;

  @Column({ type: "tinyint", width: 1, default: 0 })
  notice: number | boolean;
}
export default ShowSettings;
