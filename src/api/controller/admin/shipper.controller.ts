import { Request, Response } from "express";
import { Equal, In, Not } from "typeorm";
import {
  freightTemplateDelete,
  freightTemplateFind,
  freightTemplateFindBy,
  freightTemplateInsert,
  freightTemplateUpdate,
} from "../../model/repository/freight_template.repository";
import {
  freightDetailInsert,
  freightDetailUpdate,
} from "../../model/repository/freight_template_detail.repository";
import {
  freightTemplateGroupFindBy,
  freightTemplateGroupInsert,
  freightTemplateGroupUpdate,
} from "../../model/repository/freight_template_group.repository";
import {
  postcodeFind,
  postcodeFindBy,
  postcodesDistinctOnFindBy,
} from "../../model/repository/postcode.repository";
import logger from "../../util/logger";

const NAMESPACE = "Shipper";

export const getFreightList = async (req: Request, res: Response) => {
  try {
    const freightTemplateList = await freightTemplateFindBy({ is_delete: 0 });

    return res.send({ data: freightTemplateList, errmsg: "", errno: 0 });
  } catch (error: any) {
    logger.error(NAMESPACE, error.message, error);
    return res.status(500).json({ errmsg: error.message, errno: 500, error });
  }
};

export const getRegionData = async (req: Request, res: Response) => {
  try {
    // all virable name with temp is needed to format...

    let tempSa3nameAUList = await postcodesDistinctOnFindBy(
      { state: "VIC" },
      "sa3name as name, sa3 as id"
    );
    const regionAUList = tempSa3nameAUList
      .filter((item) => item.id !== "")
      .map((item) => {
        return { id: Number(item.id), name: item.name };
      });

    return res.send({ data: regionAUList, errmsg: "", errno: 0 });
  } catch (error: any) {
    logger.error(NAMESPACE, error.message, error);
    return res.status(500).json({ errmsg: error.message, errno: 500, error });
  }
};

export const addFreightTemplate = async (req: Request, res: Response) => {
  let { defaultData, info, table } = req.body;
  // return;
  try {
    const freightTemplateName = info.name;

    const freightTemplateNameFromSQL = await freightTemplateFindBy({ name: freightTemplateName });

    const hasDupName: boolean = freightTemplateNameFromSQL.length !== 0;

    if (hasDupName) return res.status(400).json({ errmsg: "Already have template...", errno: 400 });
    else {
      const freightInsertData = await freightTemplateInsert(info);
      const freightInsertedId = freightInsertData.identifiers[0].id;
      const defaultFreightData = defaultData[0];

      delete defaultFreightData.freeByMoney;
      delete defaultFreightData.freeByNumber;

      Object.assign(defaultFreightData, { template_id: freightInsertedId, is_default: 1 });

      //   const freightGroupInsertId = await freightTemplateGroupInsert(defaultFreightData);
      await Promise.all(
        table.map(async (item: any) => {
          item.area = item.area.substring(2);
          item.template_id = freightInsertedId;
          delete item.areaName;
          item.free_by_money = item.free_by_money === true ? 1 : 0;
          item.free_by_number = item.free_by_number === true ? 1 : 0;

          const freightGroupInsertResult = await freightTemplateGroupInsert(item);
          const freightGroupInsertedId = freightGroupInsertResult.identifiers[0].id;
          await Promise.all(
            item.area.split(",").map(async (item: any) => {
              await freightDetailInsert({
                template_id: freightInsertedId,
                group_id: freightGroupInsertedId,
                area: item,
              });
            })
          );
        })
      );
      return res.send({ data: 1, errmsg: "", errno: 0 });
    }
  } catch (error: any) {
    logger.error(NAMESPACE, error.message, error);
    return res.status(500).json({ errmsg: error.message, errno: 500, error });
  }
};

export const updateFreightTemplate = async (req: Request, res: Response) => {
  let { defaultData, info, table } = req.body;
  try {
    await freightTemplateUpdate(info.id, info);
    const hasTableData: boolean = table.length !== 0;

    if (hasTableData) {
      await freightTemplateGroupUpdate({ template_id: info.id }, { is_default: 0, is_delete: 1 });
      await freightDetailUpdate({ template_id: info.id }, { is_delete: 1 });

      await Promise.all(
        table.map(async (item: any) => {
          delete item.id;
          item.template_id = info.id;
          delete item.freeByMoney;
          delete item.freeByNumber;
          logger.debug(NAMESPACE, "item area: ", item.area);
          item.area = Array.isArray(item.area) ? item.area.join() : item.area.substring(2);

          const insertResult = await freightTemplateGroupInsert(item);
          const freightGroupId = insertResult.identifiers[0].id;
          await Promise.all(
            item.area.split(",").map(async (item: any) => {
              await freightDetailInsert({
                template_id: info.id,
                group_id: freightGroupId,
                area: item,
              });
            })
          );
        })
      );
    } else {
      await freightTemplateGroupUpdate({ template_id: info.id }, { is_default: 0, is_delete: 1 });
      await freightDetailUpdate({ template_id: info.id }, { is_delete: 1 });
    }

    return res.send({ data: 1, errmsg: "", errno: 0 });
  } catch (error: any) {
    logger.error(NAMESPACE, error.message, error);
    return res.status(500).json({ errmsg: error.message, errno: 500, error });
  }
};

export const getFreightTemplateDetail = async (req: Request, res: Response) => {
  let { id } = req.body;
  try {
    const freightGroupList = await freightTemplateGroupFindBy({
      template_id: id,
      is_delete: 0,
      area: Not(Equal("0")),
    });
    await Promise.race(
      freightGroupList.map(async (item) => {
        item.freeByNumber = item.free_by_number > 0 ? true : false;
        item.freeByMoney = item.free_by_money > 0 ? true : false;
        item.area = String(item.area).split(",");
        // item.area = [...item.area, String(item.area)];
        const tempRegionList = await postcodesDistinctOnFindBy(
          {
            sa3: In(item.area),
          },
          "sa3name as name"
        );
        const regionList = tempRegionList.map((region) => region.name);
        item.areaName = regionList.join(",");
      })
    );

    const [freight] = await freightTemplateFindBy({ id: id });

    const defaultData = await freightTemplateGroupFindBy({
      template_id: id,
      area: 0,
      is_delete: 0,
    });

    const info = { freight: freight, data: freightGroupList, defaultData };
    return res.send({ data: info, errmsg: "", errno: 0 });
  } catch (error: any) {
    logger.error(NAMESPACE, error.message, error);
    return res.status(500).json({ errmsg: error.message, errno: 500, error });
  }
};

export const deleteFreightTemplate = async (req: Request, res: Response) => {
  let { id } = req.body;
  try {
    await freightTemplateDelete(id);
    return res.send({ data: 1, errmsg: "", errno: 0 });
  } catch (error: any) {
    logger.error(NAMESPACE, error.message, error);
    return res.status(500).json({ errmsg: error.message, errno: 500, error });
  }
};
