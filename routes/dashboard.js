const express = require("express");
const router = express.Router();
const Activity = require("../models/activity");

//get all data
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
    let result = initialData;
    const activities = await Activity.find({ activity_status: true });
    const today = new Date(new Date().setUTCHours(0, 0, 0, 0));
    const firstDayOfWeek = today.getDate() - today.getDay();
    const lastDayOfWeek = today.getDate() + today.getDay();

    const weeklyActivityData = activities.filter((item) => {
      const isThisWeekData =
        item.date >= new Date(today.setDate(firstDayOfWeek)) &&
        item.date <= new Date(today.setDate(lastDayOfWeek));
      if (isThisWeekData) return item;
    });

    weeklyActivityData.forEach((item) => {
      const activityDayOfWeek = new Date(item.date).getDay();
      const dayDuration = result.durationPerDay[activityDayOfWeek];
      dayDuration.value += item.duration;
      const duplicatedActivity = result.activityPerWeek.find(
        (resultArray) => resultArray.activityType === item.activity_type
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

//get data by id
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  //set format for use on bar-chart and pie-chart
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

    //กำหนดตัวแปร activities ไปหาข้อมูลที่ต้องการ จาก Database ของ Activity
    const activities = await Activity.find({
      //ต้องการค่าอะไรมาใช้บ้าง
      created_by: id,
      activity_status: true,
    });

    //กำหนดให้ today, fistDay, lastDay และ .setUTCHours ให้เท่ากันทั้งหมด ไม่นับเวลาที่กรอกมา
    const today = new Date(new Date().setUTCHours(0, 0, 0, 0));
    const fistDay = new Date(new Date().setUTCHours(0, 0, 0, 0));
    const lastDay = new Date(new Date().setUTCHours(0, 0, 0, 0));

    //วันแรกของสัปดาห์นี้ = วันนี้ของเดือน - วันของสัปดาห์
    //.getDate() ได้วันที่ 1-31
    //.getDay()  ได้ค่าวัน 0-6 (อาทิตย์=0, เสาร์=6)
    //วันนี้ อาทิตย์ ที่ 22 เดือนตุลาคม 2566
    //example: 22-6(วันอาทิตย์) = 16(วันจันทร์)
    //.setDate() reassign ค่าวัน fistDay, lastDay
    const firstDayOfWeek = new Date(
      fistDay.setDate(today.getDate() - today.getDay())
    );

    const lastDayOfWeek = new Date(
      lastDay.setDate(today.getDate() + (6 - today.getDay()))
    );

    //.setUTCHours(23, 59, 59) กำหนดเวลาสิ้นสุดวันสุดท้ายของสัปดาห์
    const lastDayBeforeMidnight = new Date(
      lastDayOfWeek.setUTCHours(23, 59, 59)
    );

    //ไปกรองข้อมูล weeklyActivityData จาก Database ของ Activity ที่อยู่ในช่วง 1 สัปดาห์
    const weeklyActivityData = activities.filter((item) => {
      const isThisWeekData =
        item.date >= firstDayOfWeek && item.date <= lastDayBeforeMidnight;
      if (isThisWeekData) return item;
    });

    // pie-chrat: ใช้ข้อมูล ประเภทกีฬา และ จำนวนครั้งที่ออกกำลังกาย ต่อ สัปดาห์
    //นำการ์ดข้อมูลแต่ละใบลูปหา
    //loop ที่ 1 จะได้วัน และ ระยะเวลา
    //เอาค่าตัวเลขที่ได้ match กับ index ใน durationPerDay มีค่า 0-6 ที่มีค่าตรงกับ .getDay

    weeklyActivityData.forEach((item) => {
      const activityDayOfWeek = new Date(item.date).getDay(); //หาวันของสัปดาห์
      const dayDuration = result.durationPerDay[activityDayOfWeek];
      dayDuration.value += item.duration;

      //loop ที่ 2 จะได้จำนวนครั้ง(value) และ ประเภท(activityType)
      //การ์ดที่ได้จาก loop 1 เอามาใช้ลูปใน loop ที่ 2
      //มีการออกกำลังกายแต่ละประเภทกี่ครั้ง ต่อ สัปดาห์
      //การด์ที่สร้างมา activityType ตรงกับ activity_type ของ activitySchema ไหม
      //activityPerWeek มีค่าเป็น arr [] ว่างเปล่า
      //ค่าแรกจากการ์ดใบแรกที่ลูปมาจะเอาไปใส่ใน arr และให้ค่า value = 1
      //การ์ดใบต่อมา ถ้าค่า activityType ซ้ำกัน ให้เพิ่มค่า value + 1

      const duplicatedActivity = result.activityPerWeek.find(
        (resultArray) => resultArray.activityType === item.activity_type
      );

      console.log(duplicatedActivity);

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
