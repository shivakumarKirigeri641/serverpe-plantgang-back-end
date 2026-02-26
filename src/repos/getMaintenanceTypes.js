const { connectDB } = require("../database/connectDB");
const pool = connectDB();
const getMaintenanceTypes = async () => {
  try {
    const result = await pool.query(
      `select id, maintenance_name, description from maintenance_type order by maintenance_name`,
    );
    return {
      statuscode: 200,
      successstatus: true,
      message: "Maintenance types list fetched successfully.",
      data: result.rows,
    };
  } catch (err) {
    return {
      statuscode: 500,
      successstatus: false,
      message: err.message,
    };
  }
};
module.exports = getMaintenanceTypes;
