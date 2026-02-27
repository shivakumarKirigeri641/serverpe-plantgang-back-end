const { connectDB } = require("../database/connectDB");
const pool = connectDB();
const getCart = async (ipAddress, user_agent) => {
  try {
    const result_plants_details = await pool.query(
      `
        WITH paginated_products AS (
    SELECT p.*
    FROM products p
    WHERE p.is_active = TRUE
    ORDER BY p.product_name
)

SELECT
    cate.id AS category_id,
    cate.category_name,
    cate.description AS category_description,

    sub.id AS sub_id,
    sub.sub_category_name,
    sub.description AS subcategory_description,

    p.id AS product_id,
    p.product_name,
    p.slug,
    p.base_price,
    p.comparable_price,
    p.description AS product_description,
    p.average_rating,
    p.total_ratings,
    p.is_active,
    p.is_featured,
    p.is_available,

    n.id AS nursery_id,
    n.nursery_name,

    m.maintenance_name,
    m.description AS maintenance_description,
	c.id as cart_id,
	c.fkuser_profile,
	c.ip_address, 
	c.user_agent,
	c.quantity,
    COALESCE(img.images, '[]') AS product_images

FROM paginated_products p

LEFT JOIN plant_category cate ON cate.id = p.category_id
LEFT JOIN plant_sub_category sub ON sub.id = p.sub_category_id
LEFT JOIN nursery_profile n ON n.id = p.nursery_id
LEFT JOIN maintenance_type m ON m.id = p.maintenance_type_id
LEFT JOIN user_cart c on c.fkproducts = p.id

LEFT JOIN (
    SELECT 
        pi.product_id,
        json_agg(
            'https://plantsgangapi.serverpe.in/uploads/images/products/' 
            || pi.product_id 
            || '/' 
            || pi.image_name
            ORDER BY pi.sort_order
        ) AS images
    FROM product_images pi
    GROUP BY pi.product_id
) img ON img.product_id = p.id
where ip_address=$1 and user_agent=$2
ORDER BY cate.category_name, sub.sub_category_name, p.product_name;`,
      [ipAddress, user_agent],
    );
    const total_amount_details = {};
    let amount = 0;
    let plants = 0;
    if (0 < result_plants_details.rows.length) {
      for (let i = 0; i < result_plants_details.rows.length; i++) {
        plants++;
        amount =
          amount +
          result_plants_details.rows[i].quantity *
            result_plants_details.rows[i].base_price;
      }
    }
    return {
      statuscode: 200,
      successstatus: true,
      message: "Cart details fetch successfull.",
      data: {
        result_plants_details: result_plants_details.rows,
        total_amount_details: { toatl_amount: amount, plant_count: plants },
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
module.exports = getCart;
