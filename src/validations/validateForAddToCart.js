const validateForAddToCart = (req) => {
  if (!req.body) {
    return {
      statuscode: 404,
      successstatus: false,
      message: "no request body found!",
    };
  }
  if (!req.body.product_id) {
    return {
      statuscode: 404,
      successstatus: false,
      message: "product id not found!",
    };
  }
  return { statuscode: 200, successstatus: true, message: "success" };
};
module.exports = validateForAddToCart;
