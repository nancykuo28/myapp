const {
  isDate,
  sendResponse,
  updateTable,
  createToTable,
} = require("../models/base");
const db = require("../db");
const express = require("express");
const router = express.Router();
// 搜尋全部文章
router.get("/", function (req, res) {
  db.execute(
    `SELECT article.*, account.user_name
  FROM article
  INNER JOIN account ON article.author = account.user_no`
  )
    .then((data) => {
      if (data[0].length === 0) {
        sendResponse(res, "404", "FAIL", [], false, "查無資料");
      } else {
        sendResponse(res, "200", "OK", data[0], true, "成功");
      }
    })
    .catch((err) => {
      console.log(`error: ${err}`);
      sendResponse(res, "500", "FAIL", [], false, "內部錯誤");
    });
});
// 搜尋單筆文章
router.get("/:article_no", function (req, res) {
  db.execute(
    `SELECT article.*, account.user_name
  FROM article
  INNER JOIN account ON article.author = account.user_no
  WHERE article.article_no=?`,
    [req.params.article_no]
  )
    .then((data) => {
      if (data[0].length === 0) {
        sendResponse(res, "404", "FAIL", data[0], false, "查無資料");
      } else {
        sendResponse(res, "200", "OK", data[0], true, "成功");
      }
    })
    .catch((err) => {
      console.log(`error: ${err}`);
      sendResponse(res, "500", "FAIL", [], false, "內部錯誤");
    });
});
// 更新單筆文章
router.post("/updateArticle", (req, res) => {
  const data = req.body;
  if (data.upddate && !isDate(data.upddate)) {
    sendResponse(res, "404", "FAIL", [], false, "日期格式錯誤，請重新輸入");
    return;
  }
  if (!data.article_no) {
    sendResponse(res, "404", "FAIL", [], false, "無文章編號，請重新輸入");
    return;
  }
  if (data.status && isNaN(data.status)) {
    sendResponse(res, "404", "FAIL", [], false, "狀態錯誤，請重新輸入");
    return;
  }
  const updateFields = {};
  Object.keys(data).forEach((key) => {
    if (data[key] && key !== "article_no") {
      updateFields[key] = data[key];
    }
  });
  // 如果沒有提供任何要更新的欄位，回傳訊息
  if (Object.keys(updateFields).length === 0) {
    sendResponse(res, "200", "OK", [], true, "沒有更新文章內容");
    return;
  }
  const sql = updateTable(
    "article",
    updateFields,
    `article_no='${data.article_no}'`
  );
  const articleNo = data.article_no;
  db.execute(sql)
    .then((result) => {
      if (result[0].affectedRows === 0) {
        sendResponse(res, "404", "FAIL", [], false, "修改失敗");
      } else {
        db.execute(`SELECT * FROM article WHERE article_no = '${articleNo}'`)
          .then((data) => {
            const dataObject = data[0];
            const isEmpty = data[0].length === 0;
            if (isEmpty) {
              sendResponse(res, "404", "FAIL", [], false, "查無資料");
            } else {
              sendResponse(res, "200", "OK", dataObject, true, "修改成功");
            }
          })
          .catch((err) => {
            console.log(`inner error: ${err}`);
            sendResponse(res, "500", "FAIL", [], false, "內部錯誤");
          });
      }
    })
    .catch((err) => {
      console.log(`error: ${err}`);
      sendResponse(res, "500", "FAIL", [], false, "內部錯誤");
    });
});
// 新增單筆文章
router.post("/createArticle", (req, res) => {
  let newNo;
  const data = req.body;

  const createFields = {
    status: data.status,
    author: data.author,
    title: data.title,
    content: data.content,
    images: data.images,
    credate: data.credate,
    upddate: data.upddate,
  };
  db.execute(
    "SELECT article_no FROM article ORDER BY article_no DESC LIMIT 0 , 1;"
  )
    .then((data) => {
      console.log(data[0]);
      const lastNo = data[0][0].article_no;
      newNo = Number(lastNo) + 1;
      createFields.article_no = newNo;
      const sql = createToTable("article", createFields);
      db.execute(sql).then((result) => {
        const insertedId = Number(result[0].insertId);
        if (insertedId === newNo) {
          sendResponse(
            res,
            "200",
            "OK",
            [],
            true,
            `新增編號為${insertedId}的文章`
          );
        }
      });
    })
    .catch((err) => {
      console.log(`error: ${err}`);
      sendResponse(res, "500", "FAIL", [], false, "內部錯誤");
    });
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
