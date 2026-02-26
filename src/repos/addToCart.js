const { connectDB } = require("../database/connectDB");
const getCart = require("./getCart");
const pool = connectDB();
const addToCart = async (product_id, ipAddress, user_agent) => {
  try {
    let result_updated_cart = [];
    let result_updated_product_in_cart = [];
    //first check product_id is valid or not
    const result_product_exist = await pool.query(
      `select id from products where id=$1`,
      [product_id],
    );
    if (0 === result_product_exist.rows.length) {
      return {
        statuscode: 404,
        successstatus: false,
        message: `Product with id:${product_id} not found or Invalid!`,
      };
    }
    //now check if product_id is already exists in cart
    const result_cart_details = await pool.query(
      `select id, quantity from cart where fkproducts=$1 and ip_address=$2 and user_agent=$3`,
      [product_id, ipAddress, user_agent],
    );
    if (0 === result_cart_details.rows.length) {
      //if insert the product_id
      result_updated_product_in_cart = await pool.query(
        `insert into cart (fkproducts, ip_address, user_agent, quantity) values ($1, $2, $3, $4) returning *`,
        [product_id, ipAddress, user_agent, 1],
      );
    } else {
      //if exists, increment the quantity
      result_updated_product_in_cart = await pool.query(
        `update cart set quantity= $1 where fkproducts=$2 and ip_address=$3 and user_agent=$4 returning *`,
        [
          result_cart_details.rows[0].quantity + 1,
          product_id,
          ipAddress,
          user_agent,
        ],
      );
    }
    //call getCart
    result_updated_cart = await getCart(ipAddress, user_agent);
    return {
      statuscode: 200,
      successstatus: true,
      message: "Updated cart successfull.",
      data: {
        result_updated_cartlist: result_updated_cart.data,
        udpated_cart_details: result_updated_product_in_cart.rows[0],
      },
    };
  } catch (err) {
    return {
      statuscode: 500,
      successstatus: false,
      message: err.message,
    };
  }
};
module.exports = addToCart;
