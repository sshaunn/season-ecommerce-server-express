import Admin from "../entity/admin.entity";
import { dataSource } from "../data-source";
import { DeleteResult, FindOptionsWhere, ObjectID, ObjectLiteral } from "typeorm";
import BaseRepository from "./Base.Repository";

const adminRepo = new BaseRepository(Admin, dataSource);

export const adminDelete = async (
  id:
    | string
    | number
    | string[]
    | Date
    | ObjectID
    | number[]
    | Date[]
    | ObjectID[]
    | FindOptionsWhere<Admin>
): Promise<DeleteResult> => {
  return await adminRepo.delete(id);
};

export const adminFindById = async (
  where: FindOptionsWhere<Admin> | FindOptionsWhere<Admin>[]
): Promise<Admin | null> => {
  return await adminRepo.findOneBy(where);
};
class AdminRepository {
  public static findByName = async (username: any): Promise<Admin | null> => {
    const adminRepository = await dataSource.getRepository<Admin | null>(Admin);
    const admins = await adminRepository.findOneBy({ username: username });
    return admins;
  };

  public static updateById = async (id: number, updateData: Object): Promise<void> => {
    const adminRepository = dataSource.getRepository<Admin>(Admin);
    await adminRepository.update(id, updateData);
  };

  public static insertNew = async (insertData: Object): Promise<ObjectLiteral> => {
    const adminManager = dataSource.manager;
    const result = await adminManager
      .createQueryBuilder()
      .insert()
      .into(Admin)
      .values(insertData)
      .execute();
    const admin = result.generatedMaps[0];
    return admin;
  };
}

export default AdminRepository;
