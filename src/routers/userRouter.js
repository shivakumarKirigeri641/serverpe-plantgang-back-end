const express = require("express");
const checkServerPeUser = require("../middlewares/checkServerPeUser");
const updateLogoutEntry = require("../repos/updateLogoutEntry");
const validateLogout = require("../validations/validateLogout");
const userRouter = express.Router();
// ======================================================
//                LOGOUT
// ======================================================
userRouter.post(
  "/plantgangs/user/logout",
  checkServerPeUser,
  async (req, res) => {
    try {
      let validationresult = validateLogout(req);
      if (validationresult.successstatus) {
        await updateLogoutEntry(req.mobile_number);
      }
      res.clearCookie("token", {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
      });

      return res.status(200).json({
        poweredby: "plantsgang.serverpe.in",
        successstatus: true,
        statuscode: 200,
        message: "Logged out successfully",
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({
        poweredby: "plantsgang.serverpe.in",
        error: "Internal Server Error",
        message: err.message,
      });
    }
  },
);
// ======================================================
//                CHECK-OUT
// ======================================================
userRouter.get(
  "/plantgangs/user/check-out",
  checkServerPeUser,
  async (req, res) => {
    try {
    } catch (err) {
      console.error(err);
      return res.status(500).json({
        poweredby: "plantsgang.serverpe.in",
        error: "Internal Server Error",
        message: err.message,
      });
    } finally {
    }
  },
);
// ======================================================
//                PLACE-ORDER
// ======================================================
userRouter.get(
  "/plantgangs/user/place-order",
  checkServerPeUser,
  async (req, res) => {
    try {
    } catch (err) {
      console.error(err);
      return res.status(500).json({
        poweredby: "plantsgang.serverpe.in",
        error: "Internal Server Error",
        message: err.message,
      });
    } finally {
    }
  },
);
// ======================================================
//                PURCHASE-HISTORY
// ======================================================
userRouter.get(
  "/plantgangs/user/purchase-history",
  checkServerPeUser,
  async (req, res) => {
    try {
    } catch (err) {
      console.error(err);
      return res.status(500).json({
        poweredby: "plantsgang.serverpe.in",
        error: "Internal Server Error",
        message: err.message,
      });
    } finally {
    }
  },
);
module.exports = userRouter;
