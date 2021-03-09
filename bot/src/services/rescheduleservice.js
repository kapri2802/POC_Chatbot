const axios = require('axios')

function botService(query) {
console.log(query)
var pnrID = parseInt(query.slots["pnrId"] , 10);
console.log(pnrID)
  return axios.post('https://qlxi11ncsg.execute-api.us-east-1.amazonaws.com/v1', {
    "type": "search" , 
    "pnr_ID": pnrID
  })
  .then((response) => {
    console.log(response);
    console.log(response.data);
      return response.data;
    });
}

export default botService;