const express = require("express");
const router = express.Router();
const Activity = require("../models/activity");

// const activityType = {
//   Running: "running",
//   Walking: "walking",
//   Cycling: "cycling",
//   Swimming: "swimming",
//   Hiking: "hiking",
//   WeightTraining: "weight_training",
//   Yoga: "yoga",
//   Surfing: "surfing",
//   Basketball: "basketball",
//   Football: "football",
//   Badminton: "badminton",
//   Tennis: "tennis",
//   Volleyball: "volleyball",
// };

router.get("/", async (req, res) => {
  //durationPerDay = bar-chart
  //activityPerWeek = pie-chart
  const initialData = {
    durationPerDay: [
      {
        day: "sun",
        value: 0,
      },
      {
        day: "mon",
        value: 0,
      },
      {
        day: "tue",
        value: 0,
      },
      {
        day: "wed",
        value: 0,
      },
      {
        day: "thu",
        value: 0,
      },
      {
        day: "fri",
        value: 0,
      },
      {
        day: "sat",
        value: 0,
      },
    ],
    activityPerWeek: [],
  };
  //เตรียมข้อมูลให้เป็นรูปแบบเดียวกันกับ initialData
  try {
    //สัปดาห์นี้มีการออกกำลังกายไหม this week!
    //เวลาที่บันทึกมา คือวันอะไร(จ. อ. พ.?)
    //การ์ดออกกำลังกายที่บันทึกมา อยู่ในช่วงสัปดาห์ของเวลาปัจจุบันหรือไม่?
    let result = initialData;
    const activities = await Activity.find({ activity_status: true });
    const today = new Date(new Date().setUTCHours(0, 0, 0, 0));
    const firstDayOfWeek = today.getDate() - today.getDay();
    const lastDayOfWeek = today.getDate() + today.getDay();

    //ถ้าอยู่ในช่วงสัปดาห์ปัจจุบัน ให้แสดงผลประเภทออกกำลังกายในการ์ดนั้นออกมา
    const weeklyActivityData = activities.filter((item) => {
      const isThisWeekData =
        item.date >= new Date(today.setDate(firstDayOfWeek)) &&
        item.date <= new Date(today.setDate(lastDayOfWeek));
      if (isThisWeekData) return item;
    });

    //มี activity ซ้ำกันไหม ให้รวมเป็นค่าเดียว
    weeklyActivityData.forEach((item) => {
      //แล้วออกกำลังกายวันไหน (จ อ พ)
      const activityDayOfWeek = new Date(item.date).getDay();
      const dayDuration = result.durationPerDay[activityDayOfWeek];
      dayDuration.value += item.duration;
      //นับค่าเดียวกัน ไว้ในก้อนเดียวกัน
      const duplicatedActivity = result.activityPerWeek.find(
        (activity) => activity.activityType === item.activity_type
      );

      //ถ้าค่าไม่ซ้ำเอาไปใส่ใน arr ไว้ก่อนได้เลย
      if (!duplicatedActivity) {
        result.activityPerWeek.push({
          activityType: item.activity_type,
          value: 1,
        });
      }
      //ถ้าซ้ำกัน ให้นับค่าเพิ่ม arr เดิมมีโครงอยู่แล้ว ค่านี้จะถูกแสดงเลย
      else {
        duplicatedActivity.value++;
      }
    });
    res.status(200).json(result);
  } catch (error) {
    console.log("Get dashboard error", error);
    res.status(500).json({ error: "Get dashboard error" });
  }
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  const initialData = {
    durationPerDay: [
      {
        day: "sun",
        value: 0,
      },
      {
        day: "mon",
        value: 0,
      },
      {
        day: "tue",
        value: 0,
      },
      {
        day: "wed",
        value: 0,
      },
      {
        day: "thu",
        value: 0,
      },
      {
        day: "fri",
        value: 0,
      },
      {
        day: "sat",
        value: 0,
      },
    ],
    activityPerWeek: [],
  };

  try {
    let result = initialData;
    const activities = await Activity.find({
    //ต้องการค่าอะไรบ้าง
      userId: id,
      activity_status: true,
    });
    const today = new Date(new Date().setUTCHours(0, 0, 0, 0));
    const firstDayOfWeek = today.getDate() - today.getDay();
    const lastDayOfWeek = today.getDate() + today.getDay();

    const weeklyActivityData = activities.filter((item) => {
      const isThisWeekData =
        item.date >= new Date(today.setDate(firstDayOfWeek)) &&
        item.date <= new Date(today.setDate(lastDayOfWeek));
      if (isThisWeekData) return item;
    });
    // piechrat
    weeklyActivityData.forEach((item) => {
      const activityDayOfWeek = new Date(item.date).getDay();
      const dayDuration = result.durationPerDay[activityDayOfWeek];
      dayDuration.value += item.duration;

      const duplicatedActivity = result.activityPerWeek.find(
        (activity) => activity.activityType === item.activity_type
      );

      if (!duplicatedActivity) {
        result.activityPerWeek.push({
          activityType: item.activity_type,
          value: 1,
        });
      } else {
        duplicatedActivity.value++;
      }
    });

    res.status(200).json(result);
  } catch (error) {
    console.log("Get dashboard error", error);
    res.status(500).json({ error: "Get dashboard error" });
  }
});

module.exports = router;
