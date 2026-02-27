const express = require("express");
const insertOtpEntry = require("../repos/insertOtpEntry");
const verifyOtpEntry = require("../repos/verifyOtpEntry");
const validateverifyOtp = require("../validations/validateverifyOtp");
const validatesendOtp = require("../validations/validatesendOtp");
const validateForAddToCart = require("../validations/validateForAddToCart");
const validateForRemoveFromCart = require("../validations/validateForRemoveFromCart");
const generateToken = require("../utils/generateToken");
const getAllPlants = require("../repos/getAllPlants");
const getCart = require("../repos/getCart");
const clearCart = require("../repos/clearCart");
const addToCart = require("../repos/addToCart");
const removeFromCart = require("../repos/removeFromCart");
const getMaintenanceTypes = require("../repos/getMaintenanceTypes");
const generalRouter = express.Router();

// ======================================================
//                SEND OTP
// ======================================================
generalRouter.post("/plantgangs/user/send-otp", async (req, res) => {
  try {
    let validationresult = validatesendOtp(req);

    if (validationresult.successstatus) {
      const otp = "1234"; // static for now
      //const result_otp = generateOtp();
      validationresult = await insertOtpEntry(req.body.mobile_number, otp);
    }
    return res.status(validationresult.statuscode).json(validationresult);
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      poweredby: "plantsgang.serverpe.in",
      error: "Internal Server Error",
      message: err.message,
    });
  } finally {
  }
});
// ======================================================
//                VERIFY OTP
// ======================================================
generalRouter.post("/plantgangs/user/verify-otp", async (req, res) => {
  try {
    const ipAddress =
      (req.headers["x-forwarded-for"] &&
        req.headers["x-forwarded-for"].split(",")[0]) ||
      req.socket?.remoteAddress ||
      null;
    const user_agent = req.headers["user-agent"];
    let validateforverifyotpresult = validateverifyOtp(req);
    if (validateforverifyotpresult.successstatus) {
      validateforverifyotpresult = await verifyOtpEntry(
        req.body.mobile_number,
        req.body.otp,
        ipAddress,
        user_agent,
      );
      if (validateforverifyotpresult.successstatus) {
        const token = generateToken(req.body.mobile_number);
        /*res.cookie("token", token, {
          httpOnly: true,
          secure: true, // REQUIRED for SameSite=None
          sameSite: "None", // REQUIRED for cross-domain React → Node
          domain: ".serverpe.in",
        });*/
        res.cookie("token", token, {
          httpOnly: true,
          secure: false, // must be false because you're not using HTTPS
          sameSite: "lax", // must be lax or strict on localhost
          maxAge: 10 * 60 * 1000,
        });
      }
    }

    return res
      .status(validateforverifyotpresult.statuscode)
      .json(validateforverifyotpresult);
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      poweredby: "plantsgang.serverpe.in",
      mock_data: true,
      error: "Internal Server Error",
      message: err.message,
    });
  } finally {
  }
});
// ======================================================
//                ALL-PLANTS
// ======================================================
generalRouter.get("/plantgangs/user/products", async (req, res) => {
  try {
    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
    const limit = Math.min(
      Math.max(parseInt(req.query.limit, 10) || 10, 1),
      100,
    );
    let validationresult_plantcategories = await getAllPlants(page, limit);
    return res
      .status(validationresult_plantcategories.statuscode)
      .json(validationresult_plantcategories);
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      poweredby: "plantsgang.serverpe.in",
      error: "Internal Server Error",
      message: err.message,
    });
  } finally {
  }
});
// ======================================================
//                CART-GENERAL
// ======================================================
generalRouter.get("/plantgangs/user/cart", async (req, res) => {
  try {
    const ipAddress =
      (req.headers["x-forwarded-for"] &&
        req.headers["x-forwarded-for"].split(",")[0]) ||
      req.socket?.remoteAddress ||
      null;
    const user_agent = req.headers["user-agent"];
    let cart_details = await getCart(ipAddress, user_agent);
    return res.status(cart_details.statuscode).json(cart_details);
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      poweredby: "plantsgang.serverpe.in",
      error: "Internal Server Error",
      message: err.message,
    });
  } finally {
  }
});
// ======================================================
//                ADD-TO-CART
// ======================================================
generalRouter.post("/plantgangs/user/add-to-cart", async (req, res) => {
  try {
    //id of plant, ipaddress, user_agent
    let validateaddtocart_result = validateForAddToCart(req);
    if (validateaddtocart_result.successstatus) {
      const ipAddress =
        (req.headers["x-forwarded-for"] &&
          req.headers["x-forwarded-for"].split(",")[0]) ||
        req.socket?.remoteAddress ||
        null;
      const user_agent = req.headers["user-agent"];
      validateaddtocart_result = await addToCart(
        req.body.product_id,
        ipAddress,
        user_agent,
      );
    }
    return res
      .status(validateaddtocart_result.statuscode)
      .json(validateaddtocart_result);
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      poweredby: "plantsgang.serverpe.in",
      error: "Internal Server Error",
      message: err.message,
    });
  } finally {
  }
});
// ======================================================
//                REMOVE-FROM-CART
// ======================================================
generalRouter.post("/plantgangs/user/remove-from-cart", async (req, res) => {
  try {
    //id of plant, ipaddress, user_agent
    let validateaddtocart_result = validateForRemoveFromCart(req);
    if (validateaddtocart_result.successstatus) {
      const ipAddress =
        (req.headers["x-forwarded-for"] &&
          req.headers["x-forwarded-for"].split(",")[0]) ||
        req.socket?.remoteAddress ||
        null;
      const user_agent = req.headers["user-agent"];
      validateaddtocart_result = await removeFromCart(
        req.body.product_id,
        ipAddress,
        user_agent,
        req.body.is_full_product ? req.body.is_full_product : false,
      );
    }
    return res
      .status(validateaddtocart_result.statuscode)
      .json(validateaddtocart_result);
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      poweredby: "plantsgang.serverpe.in",
      error: "Internal Server Error",
      message: err.message,
    });
  } finally {
  }
});
// ======================================================
//                MAINTENANCE-TYPES
// ======================================================
generalRouter.get("/plantgangs/user/maintenance-types", async (req, res) => {
  try {
    let validationresult_plantcategories = await getMaintenanceTypes();
    return res
      .status(validationresult_plantcategories.statuscode)
      .json(validationresult_plantcategories);
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      poweredby: "plantsgang.serverpe.in",
      error: "Internal Server Error",
      message: err.message,
    });
  } finally {
  }
});
// ======================================================
//                CLEAR-CART
// ======================================================
generalRouter.post("/plantgangs/user/clear-cart", async (req, res) => {
  try {
    const ipAddress =
      (req.headers["x-forwarded-for"] &&
        req.headers["x-forwarded-for"].split(",")[0]) ||
      req.socket?.remoteAddress ||
      null;
    const user_agent = req.headers["user-agent"];
    validateaddtocart_result = await clearCart(ipAddress, user_agent);
    return res
      .status(validateaddtocart_result.statuscode)
      .json(validateaddtocart_result);
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      poweredby: "plantsgang.serverpe.in",
      error: "Internal Server Error",
      message: err.message,
    });
  } finally {
  }
});
module.exports = generalRouter;
