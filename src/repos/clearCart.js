const { connectDB } = require("../database/connectDB");
const pool = connectDB();
const clearCart = async (ipAddress, user_agent) => {
  await pool.query(`delete from cart where ip_address=$1 and user_agent=$2`, [
    ipAddress,
    user_agent,
  ]);
  try {
    return {
      statuscode: 200,
      successstatus: true,
      message: "Cart cleared successfully.",
      data: [],
    };
  } catch (err) {
    return {
      statuscode: 500,
      successstatus: false,
      message: err.message,
    };
  }
};
module.exports = clearCart;
