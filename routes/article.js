const {
  isDate,
  sendResponse,
  updateTable,
  createToTable,
} = require("../models/base");
const db = require("../db");
const express = require("express");
const router = express.Router();
router.get("/", function (req, res) {
  db.execute(
    `SELECT article.*, account.user_name
  FROM article
  INNER JOIN account ON article.author = account.user_no`
  )
    .then((data) => {
      const isEmpty = data[0].length === 0;
      console.log("🚀 ~ /.then ~ data[0]:", data);
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
    `SELECT article.*, account.user_name
  FROM article
  INNER JOIN account ON article.author = account.user_no
  WHERE article.article_no=?`,
    [req.params.article_no]
  )
    .then((data) => {
      const isEmpty = data[0].length === 0;
      console.log("🚀 ~ /id.then ~ data[0]:", data);
      if (isEmpty) {
        sendResponse(res, "404", "FAIL", data[0], false, "查無資料");
      } else {
        sendResponse(res, "200", "OK", data[0], true, "成功");
      }
    })
    .catch((err) => {
      console.log(`error: ${err}`);
    });
});
// router.post("/updateArticle", (req, res) => {
//   const data = req.body;
//   if (!isDate(data.upddate)) {
//     sendResponse(res, "404", "FAIL", [], false, "日期格式錯誤，請重新輸入");
//     return;
//   }
//   if (isNaN(data.status)) {
//     sendResponse(res, "404", "FAIL", [], false, "狀態錯誤，請重新輸入");
//     return;
//   }
//   const sql = `UPDATE article SET status = '${data.status}', title = '${data.title}', content = '${data.content}', upddate = '${data.upddate}', images='${data.images}' WHERE article.article_no='${data.article_no}'`;
//   const articleNo = data.article_no;
//   db.execute(sql)
//     .then((data) => {
//       if (data[0].affectedRows === 0) {
//         sendResponse(res, "404", "FAIL", [], false, "修改失敗");
//       } else {
//         db.execute(`SELECT * FROM article WHERE article_no = '${articleNo}'`)
//           .then((result) => {
//             const resultObject = result[0];
//             console.log("🚀 ~ .then ~ resultObject:", resultObject);
//             const isEmpty = result[0].length === 0;
//             if (isEmpty) {
//               sendResponse(res, "404", "FAIL", resultObject, false, "查無資料");
//             } else {
//               sendResponse(res, "200", "OK", resultObject, true, "修改成功");
//             }
//           })
//           .catch((err) => {
//             console.log(`inner error: ${err}`);
//           });
//       }
//     })
//     .catch((err) => {
//       console.log(`error: ${err}`);
//       sendResponse(res, "500", "FAIL", resultObject, false, "內部錯誤");
//     });
// });
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
  // 如果沒有提供任何要更新的欄位，回傳錯誤訊息
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
          });
      }
    })
    .catch((err) => {
      console.log(`error: ${err}`);
      sendResponse(res, "500", "FAIL", [], false, "內部錯誤");
    });
});

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
