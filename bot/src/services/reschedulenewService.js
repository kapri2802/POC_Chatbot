const axios = require('axios')

function reschedulenewService(query,dep_city,arrival_city) {
  console.log(query)
  var sourceAirport = dep_city
  var destinationAirport = arrival_city
  var travelDate = query.slots["NewTravelDate"]
  console.log(destinationAirport)
  return axios.post('https://jigtr7ewjd.execute-api.us-east-1.amazonaws.com/v1', {
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
                  "_": sourceAirport
                },
                "Date": {
                  "_": travelDate
                }
              },
              "Arrival": {
                "AirportCode": {
                  "_": destinationAirport
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
  .then((response) => {
    // console.log(response);
    console.log(response.data);
      return response.data;
    });
}

export default reschedulenewService;