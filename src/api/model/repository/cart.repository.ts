import {
  Brackets,
  FindManyOptions,
  FindOneOptions,
  FindOptionsWhere,
  InsertResult,
  ObjectID,
  ObjectLiteral,
  SelectQueryBuilder,
  UpdateQueryBuilder,
  UpdateResult,
} from "typeorm";
import { QueryDeepPartialEntity } from "typeorm/query-builder/QueryPartialEntity";
import { dataSource } from "../data-source";
import Cart from "../entity/cart.entity";
import BaseRepository from "./Base.Repository";

const cartRepo = new BaseRepository(Cart, dataSource);
export const cartFind = async (options: FindManyOptions<Cart> | undefined): Promise<Cart[]> => {
  return await cartRepo.find(options);
};

export const cartFindOne = async (options: FindOneOptions<Cart>): Promise<Cart | null> => {
  return await cartRepo.findOne(options);
};

export const cartFindBy = async (options: FindOptionsWhere<Cart> | FindOptionsWhere<Cart>[]) => {
  return await cartRepo.findBy(options);
};

export const cartCount = async (options: FindManyOptions<Cart> | undefined): Promise<number> => {
  return await cartRepo.count(options);
};

export const cartCountBy = async (
  options: FindOptionsWhere<Cart> | FindOptionsWhere<Cart>[]
): Promise<number> => {
  return await cartRepo.countBy(options);
};

export const cartInsert = async (
  insertData: QueryDeepPartialEntity<Cart> | QueryDeepPartialEntity<Cart>[]
): Promise<InsertResult> => {
  return await cartRepo.insert(insertData);
};

export const cartFindAndCount = async (
  options: FindManyOptions<Cart> | undefined
): Promise<[Cart[], number]> => {
  return await cartRepo.findAndCount(options);
};

export const cartSumBy = async (
  column: string,
  options:
    | string
    | Brackets
    | ObjectLiteral
    | ObjectLiteral[]
    | ((qb: SelectQueryBuilder<Cart>) => string)
): Promise<number> => {
  const { sum } = await cartRepo
    .createQueryBuilder()
    .select(`SUM(${column})`, "sum")
    .where(options)
    .getRawOne();
  return sum;
};

export const cartUpdate = async (
  updateData: QueryDeepPartialEntity<Cart>,
  where:
    | string
    | Brackets
    | ObjectLiteral
    | ObjectLiteral[]
    | ((qb: UpdateQueryBuilder<Cart>) => string)
): Promise<UpdateResult> => {
  return await cartRepo.createQueryBuilder().update().set(updateData).where(where).execute();
};

// export const cartUpdate = async (critera, updateDat)

export const cartUpdateById = async (
  critera:
    | string
    | number
    | string[]
    | FindOptionsWhere<Cart>
    | Date
    | ObjectID
    | number[]
    | Date[]
    | ObjectID[],
  updateData: QueryDeepPartialEntity<Cart>
) => {
  return await cartRepo.update(critera, updateData);
};

class CartRepository {
  /**
   * Find entities that match given find options
   *
   * @param where input condition object e.g({username: 'Tom', describe: 'TomIsSmart'})
   * @returns
   */
  public static findAllBy = async (where: Object): Promise<Cart[]> => {
    const cartRepository = dataSource.getRepository(Cart);
    return await cartRepository.findBy(where);
  };

  /**
   * Find entities that match given find options
   *
   * @param where input condition object e.g({username: 'Tom', describe: 'TomIsSmart'})
   * @returns
   */
  public static countBy = async (where: Object): Promise<number> => {
    const cartRepository = dataSource.getRepository(Cart);
    return await cartRepository.countBy(where);
  };

  /**
   * Find all enetities that match given find options
   *
   * @param option find options which are 'where, order by'
   * @param limit limit display data counts for pagination
   * @param offset set up data start and end up order number
   * @returns Carts list
   */
  public static findAll = async (
    option: FindManyOptions<Cart>,
    limit?: number | undefined,
    offset?: number | undefined
  ): Promise<Cart[]> => {
    return await dataSource
      .getRepository(Cart)
      .createQueryBuilder("cart")
      .leftJoinAndSelect("cart.user", "user")
      .select(["user.nickname as nickname", "cart.*"])
      .setFindOptions(option)
      .limit(limit)
      .offset(offset)
      .getRawMany();
  };

  /**
   * Get select entities that match given findoptions and get results count
   *
   * @param option FindOptions<T> could be none
   * @param currentPage Get current page number from request for pagination
   * @param pageSize Get page size from request, if it is none, set it up to 10
   * @returns
   */
  public static findAllAndCount = async (
    option?: FindManyOptions<Cart>,
    currentPage?: number,
    pageSize?: number
  ): Promise<Object> => {
    const cartRepository = dataSource.getRepository(Cart);
    const [data, count] = await Promise.all([
      // cartRepository.find({
      //   ...option,
      //   skip: currentPage && pageSize ? (currentPage - 1) * pageSize : 0,
      //   take: pageSize,
      // }),
      cartRepository
        .createQueryBuilder("cart")
        .leftJoinAndSelect("cart.user", "user")
        .select(["user.nickname as nickname", "cart.*"])
        .setFindOptions(
          option
            ? option
            : {
                order: {
                  id: "desc",
                },
              }
        )
        .limit(Number(pageSize))
        .offset(currentPage && pageSize ? (currentPage - 1) * pageSize : 0)
        .getRawMany(),
      cartRepository.count(option),
    ]);
    const totalPages = pageSize ? Math.ceil(count / pageSize) : 0;
    return { data, count, currentPage, pageSize, totalPages };
  };
}

export default CartRepository;
