const validatesendOtp = (req) => {
  if (!req.body) {
    return {
      statuscode: 404,
      successstatus: false,
      message: "request body not found!",
    };
  }
  if (!req.body.mobile_number) {
    return {
      statuscode: 404,
      successstatus: false,
      message: "Mobile number not found!",
    };
  }
  if (!/^\d{10}$/.test(req.body.mobile_number)) {
    return {
      statuscode: 400,
      successstatus: false,
      message: "Mobile number must be exactly 10 digits!",
    };
  }
};
module.exports = validatesendOtp;
