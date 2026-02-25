const { connectDB } = require("../database/connectDB");
const pool = connectDB();
const insertOtpEntry = async (mobile_number, otp) => {
  try {
    //clear the older otps:
    await pool.query(`DELETE FROM otp_sessions WHERE expires_at < NOW();`);
    const result_userprofile = await pool.query(
      `select id, user_name from user_profile where mobile_number=$1`,
      [mobile_number],
    );
    await pool.query(
      `INSERT INTO otp_sessions (mobile_number, otp, expires_at) VALUES ($1, $2, NOW() + INTERVAL '3 minutes');`,
      [mobile_number, otp],
    );
    return {
      statuscode: 200,
      successstatus: true,
      message: "OTP sent successfully.",
      data: {
        user_name:
          result_userprofile.rows.length > 0
            ? result_userprofile.rows[0].user_name
            : null,
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
module.exports = insertOtpEntry;
