const ndc_request_body = JSON.stringify({
	"AirShoppingRQ": {
		"$": {
			"EchoToken": "{{$guid}}",
			"Version": "IATA2017.2",
			"xmlns": "http://www.iata.org/IATA/EDIST/2017.2"
		},
		"Document": {
			"Name": {
				"_": "Kronos NDC GATEWAY"
			},
			"ReferenceVersion": {
				"_": "1.0"
			}
		},
		"Party": {
			"Sender": {
				"TravelAgencySender": {
					"Name": {
						"_": "JR TECHNOLOGIES"
					},
					"IATA_Number": {
						"_": "20200154"
					},
					"AgencyID": {
						"_": "00010080"
					}
				}
			}
		},
		"CoreQuery": {
			"OriginDestinations": {
				"OriginDestination": [
					{
						"Departure": {
							"AirportCode": {
								"_": "LHR"
							},
							"Date": {
								"_": "2021-02-23"
							}
						},
						"Arrival": {
							"AirportCode": {
								"_": "BCN"
							}
						}
					}
				]
			}
		},
		"DataLists": {
			"PassengerList": {
				"Passenger": [
					{
						"$": {
							"PassengerID": "SH1"
						},
						"PTC": {
							"_": "ADT"
						}
					}
				]
			}
		}
	}
})


function reqService( url) {
  console.log("Inside request service function")
  console.log(ndc_request_body)
  return fetch(url, {
    method: "POST",
    headers: {
      'Content-Type': 'application/json', 
	  'Authorization-Key': 'fe2ge2zybvuujq5q6xnuesym'
    },
    body: ndc_request_body,
  })
    .then((response) => {
	  let valuejson = response;
	  console.log("Request Service File" + valuejson)
      return valuejson.data;
    });
}

export default reqService;
