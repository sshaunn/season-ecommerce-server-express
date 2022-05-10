import { DataSource, EntityTarget, FindManyOptions, ObjectType, Repository } from "typeorm";

/**
 * Custom repository that can be used for all repository
 */
class BaseRepository<T> extends Repository<T> {
  private dataSource: DataSource;
  private entity: ObjectType<T>;

  constructor(entity: ObjectType<T>, dataSource: DataSource) {
    super(entity, dataSource.manager, dataSource.manager.queryRunner);
    this.entity = entity;
    this.dataSource = dataSource;

    Object.assign(this, {
      manager: dataSource.manager,
      repository: dataSource.getRepository(entity),
      queryRunner: dataSource.manager.queryRunner,
    });
  }
}

export default BaseRepository;
