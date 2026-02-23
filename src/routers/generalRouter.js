const express = require("express");
const validateSendOtp = require("../../../../../Data/Projects/serverpe-back-end/serverpe-back-end/src/validations/main/validateSendOtp");
const validateforverifyotp = require("../../../../../Data/Projects/serverpe-back-end/serverpe-back-end/src/validations/main/validateverifyOtp");
const insertOtpEntry = require("../repos/insertOtpEntry");
const generalRouter = express.Router();

generalRouter.post("/plantgangs/user/send-otp", async (req, res) => {
  try {
    let validationresult = validateSendOtp(req);

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
    let validateforverifyotpresult = validateforverifyotp(req.body);
    if (validateforverifyotpresult.successstatus) {
      validateforverifyotpresult = await validateotp(
        poolMain,
        req.body.mobile_number,
        req.body.otp,
        ipAddress,
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
module.exports = generalRouter;
