const {
  isDate,
  sendResponse,
  updateTable,
  createToTable,
} = require("../models/base");
var express = require("express");
var router = express.Router();
const db = require("../db");
/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});
router.get("/GetSideMenuBackend", async function (req, res, next) {
  const mainsql =
    "SELECT * FROM `menu_backend` WHERE menu_status = 1 AND menu_lvl = 1 ORDER BY sort ASC";
  const subsql =
    "SELECT * FROM `menu_backend` WHERE menu_status = 1 AND menu_lvl = 2";

  db.execute(mainsql)
    .then((mainData) => {
      if (mainData[0].length === 0) {
        sendResponse(res, "404", "FAIL", [], false, "查無主目錄資料");
        return;
      }
      let resultMenuList = mainData[0].map((item) => ({
        menu_no: item.menu_no,
        menu_name: item.menu_name,
        menu_url: item.menu_url,
        sort: item.sort,
        sidemenu_lv2: [],
      }));
      db.execute(subsql)
        .then((subData) => {
          if (subData[0].length === 0) {
            sendResponse(res, "200", "OK", resultMenuList, true, "查詢成功");
            return;
          }
          subData[0].map((itm) => {
            const mainIndex = resultMenuList.findIndex(
              (item) => item.sort === itm.main_category
            );
            if (mainIndex !== -1) {
              console.log(`${itm.menu_name}-${itm.main_category}`);
              let subIndex = resultMenuList[mainIndex].sidemenu_lv2.length;
              resultMenuList[mainIndex].sidemenu_lv2[subIndex] = {};
              const value = resultMenuList[mainIndex].sidemenu_lv2[subIndex];
              value.main_category = itm.main_category;
              value.menu_no = itm.menu_no;
              value.menu_name = itm.menu_name;
              value.menu_url = itm.menu_url;
              value.sort = itm.sort;
            } else {
              sendResponse(res, "404", "FAIL", [], false, "目錄資料無對應");
              return;
            }
          });
          sendResponse(res, "200", "OK", resultMenuList, true, "查詢成功");
        })
        .catch((err) => {
          console.log(`error: ${err}`);
          sendResponse(res, "500", "FAIL", [], false, "內部錯誤");
        });
    })
    .catch((err) => {
      console.log(`error: ${err}`);
      sendResponse(res, "500", "FAIL", [], false, "內部錯誤");
    });
});
module.exports = router;
