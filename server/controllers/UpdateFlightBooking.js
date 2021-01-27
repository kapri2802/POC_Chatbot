const xlsx = require('xlsx')
const _ = require('lodash');


const json2xml = require('json2xml');





function applyUpdates(json_array, updateValues) {

  return json_array.map((v, k) => {

    if (v.pnrid === updateValues.pnrid) {
      let newObj = {...v}
      for (let key in updateValues) {
        if (newObj.hasOwnProperty(key) && updateValues.hasOwnProperty(key)) {
          newObj[key] = updateValues[key];
        }
      }
      return newObj;
    }
    return v
  })
}




exports.listUpdateFlightBooking = (req, res) => {
  
  let newValues = {};
  if (req.body && req.body.slots) {
    newValues = req.body.slots;
  }

  newValues["pnrid"] = Number(newValues["pnrid"]);

  // Reading the Excel workbook
  let wb = xlsx.readFile("./NDC_DATA/ndc_data.xls");

  // Reading a particular sheet of name "UpdateFlightBooking" from the excel workbook
  let ws_sheet = wb.Sheets["UpdateFlightBooking"];
  let sheet_json_Array = xlsx.utils.sheet_to_json(ws_sheet);


  //call applyUpdates function
  const update_sheet_json_array = applyUpdates(sheet_json_Array, newValues)

  //update xls
  wb.Sheets["UpdateFlightBooking"] = xlsx.utils.json_to_sheet(update_sheet_json_array);
  xlsx.writeFile(wb, "./NDC_DATA/ndc_data.xls"); 





  //Again retrieve all records from worksheet

  // Reading the Excel workbook
  wb = xlsx.readFile("./NDC_DATA/ndc_data.xls");

  // Reading a particular sheet of name "UpdateFlightBooking" from the excel workbook
  ws_sheet = wb.Sheets["UpdateFlightBooking"];
  sheet_json_Array = xlsx.utils.sheet_to_json(ws_sheet);

  //find one based on pnrid with new vaules
  sheet_json_Array_filtered = _.filter(sheet_json_Array, { "pnrid": newValues.pnrid});


  // Json array converted to Json
  let sheet_json_Array_filtered_modified = {};
  sheet_json_Array_filtered.forEach((v, k) => {
    sheet_json_Array_filtered_modified[`item${k}`] = v;
  });

  const result_json = { data: sheet_json_Array_filtered_modified };
  const result_xml = json2xml(result_json);

  res.format({
    "application/xml": function () {
      res.send(result_xml);
    },
    "application/json": function () {
      res.send({ data: sheet_json_Array_filtered });
    },
  });
}
