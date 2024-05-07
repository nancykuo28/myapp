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
module.exports = { isDate, sendResponse };
