import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import config from "../../config/config";

@Entity({ name: config.prefix + "notice" })
class Notice {
  @PrimaryGeneratedColumn("increment")
  id: number | string;

  @Column({ type: "varchar", length: 255, default: "0" })
  content: string;

  @Column({ type: "int", width: 11, default: 0 })
  end_time: number | string;

  @Column({ type: "tinyint", width: 1, default: 0 })
  is_delete: number | boolean;
}

export default Notice;
