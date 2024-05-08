import { scheduleJob } from "node-schedule";
import axios from "axios";
// generate a cron job to stay render service alive
export const scheduleCronsForCouponCheck = () => {
  scheduleJob("*/14 * * * * *", async () => {
    axios
      .get(`https://backend-chatapp-tyx0.onrender.com/admin/keep-alive`)
      .then((res) => console.log("Keep-alive Request ", res.data))
      .catch((e) =>
        console.log("Error sending keep-alive request : ", e.message)
      );
  });
};
