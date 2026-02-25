const { connectDB } = require("../database/connectDB");
const pool = connectDB();
const updateLogoutEntry = async (mobile_number) => {
  try {
    //clear the older otps:
    await pool.query(
      `UPDATE user_login_sessions
SET 
    logout_time = NOW(),
    is_logged_out = TRUE
WHERE id = (
    SELECT uls.id
    FROM user_login_sessions uls
    JOIN user_profile up
        ON up.id = uls.fkuser_profile
    WHERE up.mobile_number = $1
    ORDER BY uls.login_time DESC
    LIMIT 1
);`,
      [mobile_number],
    );
    return {
      statuscode: 200,
      successstatus: true,
      message: "OTP sent successfully.",
      data: {},
    };
  } catch (err) {
    return {
      statuscode: 500,
      successstatus: false,
      message: err.message,
    };
  }
};
module.exports = updateLogoutEntry;
