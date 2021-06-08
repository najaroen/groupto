const XLSX = require("xlsx");
const dayjs = require("dayjs");
const _ = require("lodash");

const readFile = () => {
  const workBook = XLSX.readFile("Mukawa_気象データ計測情報.csv", {
    dateNF: "M/d/YY HH:mm:ss",
  });
  const sheetName = workBook.SheetNames[0];
  const sheet = workBook.Sheets[sheetName];
  const option = XLSX.utils.decode_range(sheet["!ref"]);
  const rowStart = option.e.r;
  let list = [];
  for (let i = 0; i < rowStart; i++) {
    let cell_ref_date = XLSX.utils.encode_cell({
      c: 1,
      r: i - 1,
    });
    let cell_ref_radiation1 = XLSX.utils.encode_cell({
      c: 7,  //TODO: get from config
      r: i - 1,
    });
    let cell_ref_radiation2 = XLSX.utils.encode_cell({
      c: 8,  //TODO: get from config
      r: i - 1,
    });
    const date = dayjs(XLSX.utils.format_cell(sheet[cell_ref_date])).format(
      "YYYY-MM-DD HH:mm:ss"
    );
    const day = dayjs(XLSX.utils.format_cell(sheet[cell_ref_date])).get("date");
    const hour = dayjs(XLSX.utils.format_cell(sheet[cell_ref_date])).get(
      "hours"
    );
    const r1 = XLSX.utils.format_cell(sheet[cell_ref_radiation1]);
    const r2 = XLSX.utils.format_cell(sheet[cell_ref_radiation2]);
    const value = {
      dateTime: date,
      day: day,
      hour: hour,
      radiation1: r1,
      radiation2: r2,
    };

    list.push(value);
  }

  const mapDate = [...new Set(list.map((v) => v.day))].filter((v) => v > 0);

  let listOfDate = [];

  for (item of mapDate) {
      const getByDate = list.filter((v)=>v.day === item);
      listOfDate.push({ day: item, value: _.groupBy(getByDate, "hour")})
  }

  return listOfDate
};

const list = readFile();
console.log(list);
