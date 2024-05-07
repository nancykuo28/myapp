const mysql = require("mysql2");
const pool = mysql.createPool({
  host: "10.41.16.75",
  port: "3307",
  user: "admin1",
  password: "123456",
  database: "myapp",
});
module.exports = pool.promise();
// {
//     "statusCode": "200",
//     "message": "OK",
//     "dataList": [
//         {
//             "id": 1,
//             "article_no": "1",
//             "status": "1",
//             "author": "A00001",
//             "title": "測試",
//             "content": "<p><span>testttt</span></p>",
//             "images": "",
//             "credate": "2024-05-06T03:10:41.000Z",
//             "upddate": "2024-05-06T03:10:41.000Z",
//             "user_name": "郭寧"
//         }
//     ],
//     "result": true,
//     "resultString": "成功"
// }
