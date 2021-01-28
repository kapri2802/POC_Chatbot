const xlsx = require('xlsx')
const _ = require('lodash');


const json2xml = require('json2xml');





// exports.listNewFlightBooking = (req, res) => {

//     // Reading the Excel workbook
//     const wb = xlsx.readFile("./NDC_DATA/ndc_data.xls");


//     // Reading a particular sheet of name "Sheet1" from the excel workbook
//     const ws_sheet1 = wb.Sheets["NewFlightBooking"];
//     const sheet1_json = xlsx.utils.sheet_to_json(ws_sheet1);

//     // console.log(req.query)
//     const filtered_data = _.filter(sheet1_json,req.query)


    
 

//     res.set({'Content-type':"application/xml"})
//     res.send({data: filtered_data})
// }





exports.listNewFlightBooking = (req, res) => {
    // console.log(req.body)
  
    let filter_criteria = {};
    if (req.body && req.body.slots) {
      filter_criteria = req.body.slots;
  
      // convert string values with commas to an array
      for (let key in filter_criteria) {
        if (filter_criteria.hasOwnProperty(key)) {
          value = filter_criteria[key];
          if (typeof value === "string" || value instanceof String) {
            filter_criteria[key] = value.includes(",") ? value.split(",") : value;
          }
        }
      }
    }
    
    
    
    //ignoring the email address of the user coming from UI as input
    if( "traveleremailaddress" in filter_criteria){
      delete filter_criteria["traveleremailaddress"]
    }
  
  
    // Reading the Excel workbook
    const wb = xlsx.readFile("./NDC_DATA/ndc_data.xls");
  
    // Reading a particular sheet of name "Sheet1" from the excel workbook
    const ws_sheet = wb.Sheets["NewFlightBooking"];
    const sheet_json_Array = xlsx.utils.sheet_to_json(ws_sheet);
  
    lodashFilterPredicate = (obj) => {
      for (let key in filter_criteria) {
        // console.log('only once')
  
        if (obj.hasOwnProperty(key) && filter_criteria.hasOwnProperty(key)) {
          if (Array.isArray(filter_criteria[key])) {
            // console.log('array based filter')
            let match = false;
            filter_criteria[key].forEach((v, k) => {
              if (
                obj[key].toString().toLowerCase() === v.toString().toLowerCase()
              ) {
                match = true;
              }
            });
            if (match == false) {
              return false;
            }
          } else {
            if (
              obj[key].toString().toLowerCase() !==
              filter_criteria[key].toString().toLowerCase()
            ) {
              return false;
            }
          }
        }
      }
  
      return true;
    };
  
    const filterBy = req.body && req.body.slots ? lodashFilterPredicate : {};
  
    sheet_json_Array_filtered = _.filter(sheet_json_Array, filterBy);
  
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
  



