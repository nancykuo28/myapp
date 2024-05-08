const isDate = (str) => {
  // 建立新的Date物件，如果傳入的字串是有效的日期，則會成功建立Date物件
  const date = new Date(str);
  // 使用isNaN函式來判斷建立的Date物件是否為無效日期
  // 同時也要檢查字串是否不等於空字串，因為空字串在某些瀏覽器中可能被認為是有效日期
  return !isNaN(date) && str.trim() !== "";
};
const sendResponse = (
  response,
  statusCode,
  message,
  dataList,
  result,
  resultString
) => {
  return response.status(Number(statusCode)).send({
    statusCode,
    message,
    dataList,
    result,
    resultString,
  });
};
const updateTable = (tableName, updateFields, condition) => {
  let sql = `UPDATE ${tableName} SET `;
  // 構建 SET 子句
  Object.keys(updateFields).forEach((key, index) => {
    if (index === Object.keys(updateFields).length - 1) {
      sql += `${key} = '${updateFields[key]}'`;
    } else {
      sql += `${key} = '${updateFields[key]}', `;
    }
  });
  // 添加 WHERE 子句
  sql += ` WHERE ${condition}`;
  return sql;
};
const createToTable = (tableName, createFields) => {
  // INSERT INTO `article` (`id`, `article_no`, `status`, `author`, `title`, `content`, `images`, `credate`, `upddate`) VALUES (NULL, '4', '1', 'A00001', '測試新增文章', '<p><span>開始寫作吧</span></p>', NULL, current_timestamp(), current_timestamp())
  let sql = `INSERT INTO \`${tableName}\` `;
  let sqlItem = `(\`id\`, `;
  let sqlValueItem = `(NULL, `;
  Object.keys(createFields).forEach((key, index) => {
    if (index === Object.keys(createFields).length - 1) {
      sqlItem += `\`${key}\`) VALUES `;
      sqlValueItem += `'${createFields[key]}')`;
    } else {
      sqlItem += `\`${key}\`, `;
      sqlValueItem += `'${createFields[key]}', `;
    }
  });
  const total_sql = sql + sqlItem + sqlValueItem;
  return total_sql;
};
module.exports = { isDate, sendResponse, updateTable, createToTable };
