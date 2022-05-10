import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: "season_admin" })
class Admin {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @Column({ type: "varchar", length: 25, default: "" })
  username: string;

  @Column({ type: "varchar", length: 255, default: "" })
  password: string;

  @Column({ type: "varchar", length: 255, default: "" })
  password_salt: string;

  @Column({ type: "varchar", length: 60, default: "" })
  last_login_ip: string | undefined;

  @Column({ type: "int", width: 11, default: 0 })
  last_login_time: number;

  @Column({ type: "int", width: 1, default: 0 })
  is_delete: number;
}

export default Admin;
