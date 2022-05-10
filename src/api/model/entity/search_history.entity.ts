import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: "season_search_history" })
class SearchHistory {
  @PrimaryGeneratedColumn("increment")
  id: number | string;

  @Column({ type: "char", length: 50, default: "" })
  keyword: string;

  @Column({ type: "varchar", length: 50, default: "" })
  from: string;

  @Column({ type: "int", width: 11, default: 0 })
  add_time: number;

  @Column({ type: "varchar", length: 45 })
  user_id: number | string;
}

export default SearchHistory;
