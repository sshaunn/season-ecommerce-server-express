import e, { Request, Response, NextFunction } from "express";
import bcryptjs from "bcryptjs";
import authMiddleWare from "../../middleware/auth.middleware";
import logger from "../../util/logger";
import { dataSource } from "../../model/data-source";
import Admin from "../../model/entity/admin.entity";
import AdminRepository, {
  adminDelete,
  adminFindById,
} from "../../model/repository/admin.repository";
import { showSetFind, showsetUpdateById } from "../../model/repository/show_settings.repository";

const NAMESPACE = "Admin";

// const validateToken = async (req: Request, res: Response, next: NextFunction) => {
//   logger.info(NAMESPACE, "Token validated, admin authorized...");
//   return res.status(200).json({
//     message: "Token validated",
//   });
// };

const register = (req: Request, res: Response, next: NextFunction) => {
  let { user } = req.body;
  // console.log(req.body);
  // let password = user["password"];
  // let username = user.username;
  bcryptjs.hash(user.password, 10, async (hashError, hash) => {
    if (hashError) {
      return res.status(401).json({
        message: hashError.message,
        error: hashError,
      });
    }

    const newAdmin = await AdminRepository.insertNew({
      username: user.username,
      password: hash,
    }).catch((error) => {
      logger.error(NAMESPACE, error.message, error);
      return res.status(500).json({
        errmsg: error.message,
        errno: 500,
        error,
      });
    });
    return res.status(200).json({
      message: "Register Successful...",
      admin: newAdmin,
      errmsg: "",
      errno: 0,
    });
  });
};

const login = async (req: Request, res: Response, next: NextFunction) => {
  let { username, password } = req.body;

  await AdminRepository.findByName(username)
    .then(async (admin) => {
      if (admin) {
        bcryptjs.compare(password, admin.password, (error, result) => {
          if (error) {
            return res.status(401).json({
              errmsg: "Password Mismatch",
              errno: 401,
            });
          } else if (result) {
            authMiddleWare.signJWT(admin, (error, token) => {
              if (error) {
                return res.status(401).json({
                  errmsg: "Unable to Sign JWT",
                  errno: 401,
                  error,
                });
              } else if (token) {
                logger.info(NAMESPACE, "Auth Successful and return token");

                return res.status(200).json({
                  data: {
                    token,
                    userInfo: admin,
                  },
                  errmsg: "",
                  errno: 0,
                });
              }
            });
          } else {
            return res.status(401).json({
              errmsg: "Password Mismatch...",
              errno: 401,
            });
          }
        });
      }
      return admin?.id;
    })
    .then(async (id) => {
      if (id) {
        logger.info(NAMESPACE, "update admin login time and ip...");
        AdminRepository.updateById(id, {
          last_login_ip: req.socket.remoteAddress,
          last_login_time: Math.floor(new Date().getTime() / 1000),
        });
      } else {
        logger.warn(NAMESPACE, "Admin id not found, pls back to check");
      }
    })
    .catch((error) => {
      logger.error(NAMESPACE, error.message, error);
      return res.status(500).json({
        errmsg: error.message,
        errno: 500,
        error,
      });
    });
};

const updateAdmin = async (req: Request, res: Response) => {
  let { change, user } = req.body;

  bcryptjs.hash(user.newpassword, 10, async (hashError, hash) => {
    if (hashError) {
      return res.status(401).json({
        message: hashError.message,
        error: hashError,
      });
    }

    delete user.newpassword;

    await AdminRepository.updateById(user.id, {
      username: user.username,
      password: hash,
    }).catch((error) => {
      logger.error(NAMESPACE, error.message, error);

      return res.status(500).json({
        errmsg: error.message,
        errno: 500,
        error,
      });
    });

    return res.sendStatus(200);
  });
};

const deleteAdmin = async (req: Request, res: Response) => {
  let { id } = req.body;
  try {
    const result = await adminDelete(id);
    if (result.affected !== 0) {
      return res.json({
        affected: result.affected,
        errmsg: "",
        errno: 0,
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

const getAllAdmins = async (req: Request, res: Response, next: NextFunction) => {
  const allAdmins = await dataSource.getRepository(Admin).find();
  return res.status(200).json({
    data: allAdmins,
    count: allAdmins.length,
    errmsg: "",
    errno: 0,
  });
};

const getShowSet = async (req: Request, res: Response) => {
  try {
    const showsets = await showSetFind({ take: 1 });
    return res.send({
      data: showsets[0],
      errmsg: "",
      errno: 0,
    });
  } catch (error: any) {
    logger.error(NAMESPACE, error.message, error);

    return res.status(500).json({ errmsg: error.message, errno: 500, error });
  }
};

const updateShowset = async (req: Request, res: Response) => {
  let showset = req.body;
  // console.log(showset);
  await showsetUpdateById(showset.id, showset).then((result) => {
    const updateSuccess: boolean = result.affected !== 0;
    if (!updateSuccess) {
      return res.status(404).json({ errmsg: "Showset not found...", errno: 404 });
    } else {
      return res.send({ data: showset, errmsg: "", errno: 0 });
    }
  });
};

const getAdminDetail = async (req: Request, res: Response) => {
  let { id } = req.body;

  try {
    const admin = await adminFindById({ id: id });
    if (admin) {
      return res.json({ data: admin, errmsg: "", errno: 0 });
    }
  } catch (error: any) {
    logger.error(NAMESPACE, error.message, error);
    return res.status(500).json({ errmsg: error.message, errno: 500, error });
  }
};

export default {
  login,
  // validateToken,
  register,
  getAllAdmins,
  updateAdmin,
  getShowSet,
  updateShowset,
  deleteAdmin,
  getAdminDetail,
};
