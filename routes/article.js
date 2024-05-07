const { isDate, sendResponse } = require("../models/base");
const db = require("../db");
const express = require("express");
const router = express.Router();
router.get("/", function (req, res) {
  db.execute(
    `SELECT article_test.*, account.user_name
  FROM article_test
  INNER JOIN account ON article_test.author = account.user_no`
  )
    .then((data) => {
      const isEmpty = data[0].length === 0;
      res.status(isEmpty ? 404 : 200).send({
        statusCode: isEmpty ? "404" : "200",
        message: isEmpty ? "FAIL" : "OK",
        dataList: data[0],
        result: isEmpty ? false : true,
        resultString: isEmpty ? "查無資料" : "成功",
      });
    })
    .catch((err) => {
      console.log(`error: ${err}`);
    });
});
router.get("/:article_no", function (req, res) {
  db.execute(
    `SELECT article_test.*, account.user_name
  FROM article_test
  INNER JOIN account ON article_test.author = account.user_no
  WHERE article_test.article_no=?`,
    [req.params.article_no]
  )
    .then((data) => {
      const isEmpty = data[0].length === 0;
      if (isEmpty) {
        sendResponse(res, "404", "FAIL", resultObject, false, "查無資料");
      } else {
        sendResponse(res, "200", "OK", resultObject, true, "成功");
      }
    })
    .catch((err) => {
      console.log(`error: ${err}`);
    });
});
router.post("/updateArticle", (req, res) => {
  const data = req.body;
  if (!isDate(data.upddate)) {
    sendResponse(res, "404", "FAIL", [], false, "日期格式錯誤，請重新輸入");
    return;
  }
  if (isNaN(data.status)) {
    sendResponse(res, "404", "FAIL", [], false, "狀態錯誤，請重新輸入");
    return;
  }
  const sql = `UPDATE article_test SET status = '${data.status}', title = '${data.title}', content = '${data.content}', upddate = '${data.upddate}' WHERE article_test.article_no='${data.article_no}'`;
  const articleNo = data.article_no;
  db.execute(sql)
    .then((data) => {
      if (data[0].affectedRows === 0) {
        sendResponse(res, "404", "FAIL", [], false, "修改失敗");
      } else {
        db.execute(
          `SELECT * FROM article_test WHERE article_no = '${articleNo}'`
        )
          .then((result) => {
            const resultObject = result[0];
            console.log("🚀 ~ .then ~ resultObject:", resultObject);
            const isEmpty = result[0].length === 0;
            if (isEmpty) {
              sendResponse(res, "404", "FAIL", resultObject, false, "查無資料");
            } else {
              sendResponse(res, "200", "OK", resultObject, true, "修改成功");
            }
          })
          .catch((err) => {
            console.log(`inner error: ${err}`);
          });
      }
    })
    .catch((err) => {
      console.log(`error: ${err}`);
      sendResponse(res, "500", "FAIL", resultObject, false, "內部錯誤");
    });
});
router.post("/createArticle", (req, res) => {
  const data = req.body;
  sendResponse(res, "200", "OK", [], true, "測試成功");
});
module.exports = router;
// {
//     "statusCode": "200",
//     "message": "OK",
//     "dataList": [],
//     "result": true,
//     "resultString": "查無資料",
//     "resultInt": 0
// }
