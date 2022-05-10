import { Request, Response } from "express";
import logger from "../../util/logger";
import AddressAU from "../../model/entity/address_au.entity";
import {
  addressAUFind,
  addressAUFindOneBy,
  addressAUFindOneOrFailBy,
  addressAUInsert,
  addressAUUpdate,
  addressAUUpdateBy,
} from "../../model/repository/address_au.repository";
import { postcodeFindOneBy } from "../../model/repository/postcode.repository";
import { Equal, Not } from "typeorm";

const NAMESPACE = "ClientAddressAU";

// get the addresses from specific user by user_id
const getAddressList = async (req: Request, res: Response) => {
  let user_id = req.user_id;

  try {
    if (user_id) {
      const addressList = await addressAUFind({
        where: { user_id: user_id, is_delete: 0 },
        order: { id: "ASC" },
      });
      return res.json({
        data: addressList,
        errmsg: "",
        errno: 0,
      });
    } else {
      return res.status(401).json({
        errmsg: "You are not authorized...",
        errno: 401,
      });
    }
  } catch (error: any) {
    logger.error(NAMESPACE, error.message, error);
    return res.status(500).json({
      errmsg: error.message,
      errno: 500,
      error,
    });
  }
};

const addAddress = async (req: Request, res: Response) => {
  let user_id = req.user_id;
  let address: AddressAU = req.body;

  try {
    const isValidMobile: boolean = String(address.mobile).match("^0?(4|3)[0-9]{8}$") !== null;
    if (!isValidMobile)
      return res.status(400).json({ errmsg: "Invalid Contact Number", errno: 400 });

    const postcodeInfo = await postcodeFindOneBy({
      locality: address.suburb,
      state: "VIC",
      postcode: address.postcode,
    });

    const isValideRegion: boolean = postcodeInfo !== null;
    const isDelivery: boolean = postcodeInfo ? postcodeInfo.is_delivery === 1 : false;

    if (!isValideRegion) return res.status(400).json({ errmsg: "Invalide Suburb....", errno: 400 });
    if (!isDelivery)
      return res.status(400).json({ errmsg: "You are not in delivery range...", errno: 400 });

    const newAddress: AddressAU = {
      ...address,
      contact_name: String(address.name),
      contact_number: address.mobile!,
      user_id: user_id,
      postcode_id: Number(postcodeInfo?.id),
    };

    const addressInsertResult = await addressAUInsert(newAddress);
    console.log(addressInsertResult);
    const isDefaultAddress: boolean = address.is_default === 1;
    let addressId: number = Number(addressInsertResult.identifiers[0].id);
    if (isDefaultAddress) {
      await addressAUUpdateBy({ is_default: 0 }, { user_id: user_id, id: Not(Equal(addressId)) });
    }

    const addressDetails = await addressAUFindOneBy({ id: addressId });
    if (addressDetails) return res.send({ data: addressDetails, errmsg: "", errno: 0 });
    else return res.status(400).json({ errmsg: "Ops unknown error", errno: 400 });
  } catch (error: any) {
    logger.error(NAMESPACE, error.message, error);

    return res.status(500).json({
      errmsg: error.message,
      errno: 500,
      error,
    });
  }
};

const deleteAddress = async (req: Request, res: Response) => {
  let { id } = req.body;
  let userId = req.user_id;

  try {
    if (!userId) return res.status(401).json({ errmsg: "Unauthorization", errno: 401 });

    await addressAUUpdate(id, { is_delete: 0, is_default: 0 });
    const deletedAddressDetail = addressAUFindOneOrFailBy({ id: id });
    return res.json({ data: deletedAddressDetail, errmsg: "", errno: 0 });
  } catch (err: any) {
    logger.error(NAMESPACE, err.message, err);
    return res.status(500).json({ errmsg: err.message, errno: 500, err });
  }
};

const getAddressDetail = async (req: Request, res: Response) => {
  let { id } = req.query;
  let userId = req.user_id;

  try {
    const addressInfo = await addressAUFind({ where: { id: Number(id) } });
    const hasAddress: boolean = addressInfo.length !== 0;

    if (!hasAddress) return res.status(404).json({ errmsg: "Address not found", errno: 404 });
    if (!userId) return res.status(401).json({ errmsg: "Unauthorization", errno: 401 });
    return res.json({
      data: addressInfo[0],
      errmsg: "",
      errno: 0,
    });
  } catch (error: any) {
    logger.error(NAMESPACE, error.message, error);
    return res.status(500).json({ errmsg: error.message, errno: 500, error });
  }
};

const updateAddressDetail = async (req: Request, res: Response) => {
  let address: AddressAU = req.body;
  let userId = req.user_id;

  try {
    if (!userId) return res.status(401).json({ errmsg: "Unauthorization", errno: 401 });
    const addressDetail = await addressAUFindOneBy({ id: address.id });

    const isValidMobile: boolean = String(address.mobile).match("^0?(4|3)[0-9]{8}$") !== null;
    if (!isValidMobile)
      return res.status(400).json({ errmsg: "Invalid Contact Number", errno: 400 });

    // validate surburb and postcode ...

    const postcodeInfo = await postcodeFindOneBy({
      locality: address.suburb,
      state: "VIC",
      postcode: address.postcode,
    });
    const isValideRegion: boolean = postcodeInfo !== null;
    const isDelivery: boolean = postcodeInfo ? postcodeInfo.is_delivery === 1 : false;

    if (!isValideRegion)
      return res.status(400).json({ errmsg: "Invalide Suburb or Postcode....", errno: 400 });
    if (!isDelivery)
      return res.status(400).json({ errmsg: "You are not in delivery range...", errno: 400 });

    const newAddress: AddressAU = {
      ...address,
      contact_name: String(address.name),
      contact_number: address.mobile!,
      user_id: userId,
      postcode_id: Number(postcodeInfo?.id),
    };
    delete newAddress.name;
    delete newAddress.mobile;

    const isDefaultAddress: boolean = address.is_default === 1;
    await addressAUUpdate(String(address.id), newAddress);
    if (isDefaultAddress) {
      await addressAUUpdateBy({ is_default: 0 }, { user_id: userId, id: Not(Equal(address.id)) });
    }
    const newAddressDetail = await addressAUFindOneOrFailBy({ id: address.id });
    return res.json({ data: newAddressDetail, errmsg: "", errno: 0 });
  } catch (error: any) {
    logger.error(NAMESPACE, error.message, error);

    return res.status(500).json({ errmsg: error.message, errno: 500, error });
  }
};

export default { getAddressList, addAddress, getAddressDetail, deleteAddress, updateAddressDetail };
