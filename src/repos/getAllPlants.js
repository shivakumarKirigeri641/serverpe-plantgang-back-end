const { connectDB } = require("../database/connectDB");
const pool = connectDB();
const getAllPlants = async (page = 1, limit = 10) => {
  try {
    const offset = (page - 1) * limit;

    const baseQuery = `
from products p
join plant_sub_category sub on sub.id = p.sub_category_id
join plant_category cate on cate.id = p.category_id
join nursery_profile n on n.id = p.nursery_id
join maintenance_type m on m.id = p.maintenance_type_id`;

    // Get total count
    const countResult = await pool.query(
      `SELECT COUNT(DISTINCT p.id) AS total ${baseQuery}`,
    );
    const totalItems = parseInt(countResult.rows[0].total, 10);
    const totalPages = Math.ceil(totalItems / limit);

    // Get paginated data
    const result = await pool.query(
      `WITH paginated_products AS (
    SELECT p.*
    FROM products p
    WHERE p.is_active = TRUE
    ORDER BY p.product_name
    LIMIT $1 OFFSET $2
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

    COALESCE(img.images, '[]') AS product_images

FROM paginated_products p

LEFT JOIN plant_category cate ON cate.id = p.category_id
LEFT JOIN plant_sub_category sub ON sub.id = p.sub_category_id
LEFT JOIN nursery_profile n ON n.id = p.nursery_id
LEFT JOIN maintenance_type m ON m.id = p.maintenance_type_id

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

ORDER BY cate.category_name, sub.sub_category_name, p.product_name;`,
      [limit, offset],
    );

    return {
      statuscode: 200,
      successstatus: true,
      message: "Plant categories fetched successfully.",
      data: result.rows,
      pagination: {
        currentPage: page,
        limit: limit,
        totalItems: totalItems,
        totalPages: totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
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
module.exports = getAllPlants;
