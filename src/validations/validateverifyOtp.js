const validateverifyOtp = (req) => {
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
  if (!req.body.otp) {
    return {
      statuscode: 404,
      successstatus: false,
      message: "otp not found!",
    };
  }
  if (!/^\d{4}$/.test(req.body.otp)) {
    return {
      statuscode: 400,
      successstatus: false,
      message: "otp must be exactly 4 digits!",
    };
  }
  return { statuscode: 200, successstatus: true, message: "success" };
};
module.exports = validateverifyOtp;
