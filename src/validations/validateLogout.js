const validateLogout = (req) => {
  if (!req.mobile_number) {
    return {
      statuscode: 404,
      successstatus: false,
      message: "Mobile number not found!",
    };
  }
  if (!/^\d{10}$/.test(req.mobile_number)) {
    return {
      statuscode: 400,
      successstatus: false,
      message: "Mobile number must be exactly 10 digits!",
    };
  }
  return { statuscode: 200, successstatus: true, message: "success" };
};
module.exports = validateLogout;
