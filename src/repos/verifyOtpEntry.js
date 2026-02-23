const { connectDB } = require("../database/connectDB");
const pool = connectDB();
const verifyOtpEntry = async (mobile_number, otp, ipAddress, user_agent) => {
  try {
    //clear the older otps:
    await pool.query(`DELETE FROM otp_sessions WHERE expires_at < NOW();`);
    let result_userprofile = await pool.query(
      `select id, user_name from user_profile where mobile_number=$1`,
      [mobile_number],
    );
    const result_otpsessions = await pool.query(
      `select *from otp_sessions where mobile_number=$1 and otp = $2`,
      [mobile_number, otp],
    );
    if (0 < result_otpsessions.rows.length) {
      await pool.query(`DELETE FROM otp_sessions WHERE mobile_number=$1`, [
        mobile_number,
      ]);
      //if user_profile exists, enter in login,
      //if not exists, insert & enter in login
      if (0 === result_userprofile.rows.length) {
        result_userprofile = await pool.query(
          `insert into user_profile (mobile_number) values ($1) returning *`,
          [mobile_number],
        );
      }
      //insert int login
      await pool.query(
        `insert into user_login_sessions (fkuser_profile, ip_address, user_agent) values ($1,$2,$3) returning *`,
        [result_userprofile.rows[0].id, ipAddress, user_agent],
      );
      let result_user_login_sessions = await pool.query(
        `SELECT 
    uls.id,
    uls.login_time,
    uls.logout_time,
    (uls.logout_time - uls.login_time) AS session_duration,
    uls.ip_address,
    uls.user_agent
FROM user_login_sessions uls
JOIN user_profile up 
    ON up.id = uls.fkuser_profile
WHERE up.mobile_number = $1
ORDER BY uls.login_time DESC
LIMIT 2;`,
        [mobile_number],
      );
      return {
        statuscode: 200,
        successstatus: true,
        message: "OTP verified successfully.",
        data: {
          user_profile: result_userprofile.rows[0],
          user_current_login: result_user_login_sessions.rows[0],
          user_last_login:
            result_user_login_sessions.rows.length > 1
              ? result_user_login_sessions.rows[1]
              : {},
        },
      };
    } else {
      return {
        statuscode: 401,
        successstatus: true,
        message: "OTP expired or unauthorized user.",
        data: {},
      };
    }
  } catch (err) {
    return {
      statuscode: 500,
      successstatus: false,
      message: err.message,
    };
  }
};
module.exports = verifyOtpEntry;
