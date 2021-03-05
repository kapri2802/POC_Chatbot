import React, { Component } from "react";
import { Interactions } from "aws-amplify";
import Amplify from "aws-amplify";


import "../../App.css";
import BotService from "../../services/botService";
import ChatList from "../chatList/ChatList";
import "./styles.css";
const axios = require('axios')


Amplify.configure({
  Auth: {
    identityPoolId: "us-east-1:e8ef2317-28a9-40b1-b4c2-0f8a30b71ea9",
    region: "us-east-1",
  },
  Interactions: {
    bots: {
      TravelBookingBot: {
        name: "TravelBookingBot",
        alias: "$LATEST",
        region: "us-east-1",
      },
    },
  },
});

class ChatContainer extends Component {
  messageContainerRef = React.createRef();
  state = {
    loading: false,
    input: "",
    messages: [
      {
        id: 0,
        display: "Hello! I'm Travel Bot. I will help you with Booking",
        type: "text",
        sender: "server",
      },
      {
        id: 1,
        display: "Let me know how can i assist you..",
        type: "text",
        sender: "server",
      },
      {
        id: 2,
        type: "widget",
        heading: "Please select an option",
        children: [
          {
            id: 0,
            display: "New Booking",
            value: "newflight",
            type: "button",
            clickedMsg: "I will help you with new booking. I will ask you few questions to gather your travel planned details.",
            handler: this.submitMessage.bind(this),
          },
          {
            id: 1,
            display: "Update Booking",
            value: "updateflight",
            type: "button",
            clickedMsg: "I will help you with update booking. I will ask you few questions to gather your existing booking details.",

            handler: this.submitMessage.bind(this),
          },
          {
            id: 2,
            display: "Cancellation",
            value: "cancelflight",
            type: "button",
            clickedMsg: "I will help you with cancel booking. I will ask you few questions to gather your existing booking details.",
            handler: this.submitMessage.bind(this),
          },
        ],
      },
    ],
  };

  _handleKeyPress = (e) => {
    
    if (e.key === "Enter") {
      let inputMessage = {};
      const inputValue = this.state.input;

      inputMessage.value = inputValue;
      inputMessage.type = "input";
      inputMessage.display = inputValue;
      inputMessage.sender = "user";

      this.submitMessage(inputMessage);
    }
  };

  onChange(e) {
    const input = e.target.value;
    this.setState({ input });
  }

  async submitMessage(message) {

    this.setState({ loading: true }, () => this.scrolToRef());

    let messages = this.state.messages;

    if (message.type !== "button") {
      message.id = messages.length;
      messages = [...this.state.messages, message];

      this.setState({
        messages,
        input: "",
      }, () => this.scrolToRef());
    }

    if (message.type === "button") {
      let messageBubble = {};
      messageBubble.id = messages.length;
      messageBubble.display = message.clickedMsg;
      messageBubble.type = "text";
      messageBubble.sender = "server";

      messages = [...this.state.messages, messageBubble];

      setTimeout(() => {
        this.setState(
          {
            messages
          },
          () => this.scrolToRef()
        );
      }, 1000)
    }

    if (message && message.value) {

      this.setState({ loading: true }, () => this.scrolToRef())

      console.log("user clicked: ", message.value);

      const response = await Interactions.send(
        "TravelBookingBot",
        message.value
      );

      console.log("aws responses", response);

      let responseMessage = {
        display: response.message !== undefined ? response.message : "",
        type: "text",
        sender: "server",
      };

      messages = this.state.messages;
      responseMessage.id = messages.length;
      messages = [...this.state.messages, responseMessage];

      this.setState({ loading: false, messages }, () => this.scrolToRef());

      // When chat completes, these if-else conditions are checked
      if (response.dialogState === "ReadyForFulfillment") {
        if (response.intentName === "BookFlight_New") {
          let query = {};
          query.slots = response.slots;
          this.ndcServerResponseHandler(query);

        } else if (response.intentName === "BookFlight_Update") {

          let query = {};
          query.slots = response.slots;
          console.log(query)
          this.ndcServerUpdateResponseHandler(query);



        } else if (response.intentName === "BookFlight_Cancel") {

          let messages = this.state.messages;
          let currentId = messages.length;

          let message = {};

          message.id = currentId++;
          message.type = "text";
          message.sender = "server";
          message.display = " Your booking/service has been cancelled.";

          messages.push(message);

          setTimeout(() => {
            this.setState({ loading: false, messages }, () => this.scrolToRef())
          }, 1000);

        }
      }
    }
  }

  buttonHandler = (argu) => {

    console.log("inside button handler")

    this.setState({ loading: true }, () => this.scrolToRef())

    let messages = this.state.messages;
    let currentId = messages.length;
    let message = {};
    message.id = currentId++;
    message.type = "text";
    message.sender = "server";
    message.display = "Your have booked following flight";
    messages.push(message);
    this.setState({ loading: false, messages }, () => this.scrolToRef()) 
    this.setState({ loading: true }, () => this.scrolToRef())

    const currentdate = Date.now();
    axios.post('https://qlxi11ncsg.execute-api.us-east-1.amazonaws.com/v1', {
        "pnr_ID": currentdate,
        "dep_city" : argu.value.substr(0,3),
        "arrival_city" : argu.value.substr(7,3),
        "date" : argu.value.substr(14,10),
        "time" : argu.value.substr(25,5),
    })
      .then((response) => {
        

        messages = this.state.messages
        currentId = messages.length;
        message = {};
        message.id = currentId++;
        message.type = "text";
        message.sender = "server";
        message.display = "PNR_ID: " + currentdate + " " + argu.value ;
        messages.push(message);
        setTimeout(() => {
          this.setState({ loading: false, messages }, () => this.scrolToRef())
        }, 1000);
      });
    //LHR to BCN on 2021-03-09 12:00 --- button value
  }

  buttonHandlerIndirect = (argu) => {

    console.log("inside button handler")

    this.setState({ loading: true }, () => this.scrolToRef())

    let messages = this.state.messages;
    let currentId = messages.length;
    let message = {};
    message.id = currentId++;
    message.type = "text";
    message.sender = "server";
    message.display = "Your have booked following flight";
    messages.push(message);
    this.setState({ loading: false, messages }, () => this.scrolToRef()) 
    this.setState({ loading: true }, () => this.scrolToRef())

    const currentdate = Date.now();
    axios.post('https://qlxi11ncsg.execute-api.us-east-1.amazonaws.com/v1', {
      "pnr_ID": Date.now(),
      "dep_city" : argu.value.substr(0,3),
      "connecting_city" : argu.value.substr(7,3),
      "sourcecity_departuredate" : argu.value.substr(14,10),
      "sourcecity_departuretime" : argu.value.substr(25,5),
      "arrival_city" : argu.value.substr(60,3),
      "connectingcity_depaturedate" : argu.value.substr(67,10),
      "connectingcity_depaturetime" : argu.value.substr(78,5),
      
    })
      .then((response) => {
        

        messages = this.state.messages
        currentId = messages.length;
        message = {};
        message.id = currentId++;
        message.type = "text";
        message.sender = "server";
        message.display = "PNR_ID: " + currentdate + " " + argu.value ;
        messages.push(message);
        setTimeout(() => {
          this.setState({ loading: false, messages }, () => this.scrolToRef())
        }, 1000);
      });
    
  }

  async ndcServerResponseHandler(query) {

    this.setState({ loading: true }, () => this.scrolToRef())

    let finalMessage = null;
    finalMessage = await BotService(query, "https://jigtr7ewjd.execute-api.us-east-1.amazonaws.com/v1");
    console.log("New Booking Request Success")
    console.log(finalMessage)



    let jsonArray = [];
    let indirectArray = [];
    let flag = 0;
    let flagi = 0;
    if (finalMessage !== null) {
      var resp = finalMessage.AirShoppingRS.DataLists.FlightSegmentList.FlightSegment
      for (var i in resp) {

        if ((resp[i].Departure.AirportCode._ === query.slots["DepatureCity"]) && (resp[i].Arrival.AirportCode._ === query.slots["ArrivalCity"])) {
          flag = 1;
          var directFlight = resp[i].Departure.AirportCode._ + " to " + resp[i].Arrival.AirportCode._ + " on " + resp[i].Departure.Date._ + " " + resp[i].Departure.Time._;
          jsonArray.push(directFlight)
        }
        if ((resp[i].Departure.AirportCode._ !== query.slots["DepatureCity"]) || (resp[i].Arrival.AirportCode._ !== query.slots["ArrivalCity"])) {
          flagi = 2;

          if (resp[i].Departure.AirportCode._ === query.slots["DepatureCity"]) {
            var indirectFlight = resp[i].Departure.AirportCode._ + " to " + resp[i].Arrival.AirportCode._ + " on " + resp[i].Departure.Date._ + " " + resp[i].Departure.Time._ + "\n";
          }
          if (resp[i].Arrival.AirportCode._ === query.slots["ArrivalCity"]) {
            var indirectTrip = "\n" + resp[i].Departure.AirportCode._ + " to " + resp[i].Arrival.AirportCode._ + " on " + resp[i].Departure.Date._ + " " + resp[i].Departure.Time._;
            indirectArray.push(indirectFlight + "\t  Connecting via.. \t" + indirectTrip)
          }


        }

      }
      console.log(resp)

    }
    let messages = this.state.messages;
    let currentId = messages.length;

    let message = {};
    message.id = currentId++;
    message.type = "text";
    message.sender = "server";
    message.display = " Thanks for giving your details... fetching best fit Itinerary";

    messages.push(message);

    let msg = {};
    msg.id = currentId++;
    msg.type = "text";
    msg.sender = "server";
    msg.display = " Ticket Details are as follows : ";
    messages.push(msg);
    console.log("Flag Value " + flag)



    if (flag === 1) {
      jsonArray.map((v, k) => {
        console.log("JsonArray from NDC Response")
        console.log(jsonArray)
        let message = {};
        message.handler = this.buttonHandler;
        message.id = currentId;
        message.display = v;
        message.value = v;
        message.type = "button";
        message.sender = "ndc-server";

        messages.push(message);
        currentId++;

      });
    }

    if (flagi === 2) {
      indirectArray.map((v, k) => {
        console.log("indirectArray from NDC Response")
        console.log(indirectArray)
        console.log(v)
        let message = {};
        message.handler = this.buttonHandlerIndirect;
        message.id = currentId;
        message.display = v;
        message.value = v;
        message.type = "button";
        message.sender = "ndc-server";
        messages.push(message);
        currentId++;
      });
    }
    this.setState({ loading: false, messages }, () => this.scrolToRef())
  }


  // for update
  async ndcServerUpdateResponseHandler(query) {

    this.setState({ loading: true }, () => this.scrolToRef())

    let finalMessage = null;
    finalMessage = await BotService(
      query,
      "https://n9lmk5j0dg.execute-api.us-east-1.amazonaws.com/v1"
    );

    let jsonArray = [];
    if (finalMessage !== null) {

      for (var key in finalMessage) {
        if (finalMessage.hasOwnProperty(key)) {
          var val = finalMessage[key];
          jsonArray.push(val);
        }
      }
    }
    //setTimeout(10000);
    let messages = this.state.messages;
    let currentId = messages.length;

    let msg = {};
    msg.id = currentId++;
    msg.type = "text";
    msg.sender = "server";
    msg.display = " Thanks for giving details... updating your Itinerary";

    messages.push(msg);

    setTimeout(() => {
      this.setState({ loading: false, msg }, () => this.scrolToRef())
    }, 5000);

    let msgdetails = {};
    msgdetails.id = currentId++;
    msgdetails.type = "text";
    msgdetails.sender = "server";
    msgdetails.display = " Your modified ticket details are as follows. Please click to view details. You might have to pay for fare difference.";

    messages.push(msgdetails);
    setTimeout(() => {
      this.setState({ loading: false, messages }, () => this.scrolToRef())
    }, 1000);

    jsonArray.map((v, k) => {
      let message = {};
      message.id = currentId;
      message.display = ` ${v["airline"]} | Departure: ${v["newstartdate"]} | Cabin class: ${v["newcabinclass"]} `;
      message.value = `${v["airline"]} | Departure: ${v["newstartdate"]} | Cabin class: ${v["newcabinclass"]} `;
      message.type = "link";
      message.sender = "ndc-server";
      message.link = "https://www.bcdtravel.com/";

      messages.push(message);
      currentId++;
    });


    setTimeout(() => {
      this.setState({ loading: false, messages }, () => this.scrolToRef())
    }, 5000);
    
  }

  scrolToRef() {
    const scroll = this.messageContainerRef.current.scrollHeight - this.messageContainerRef.current.clientHeight;
    this.messageContainerRef.current.scrollTo(0, scroll);

    console.log(this.messageContainerRef.current.scrollHeight);
    console.log(this.messageContainerRef.current.clientHeight);
    console.log(scroll);
  }



  render() {
    return (
      <div >
        <div className="chat-container">
          <header className="chat-container__header">
            <p className="chat-container__header-title">Welcome to ChatBot!</p>
          </header>
          <div ref={this.messageContainerRef} className="chat-container__chat-list-container" >
            <div className="chat-container__messages-container">
              <ChatList messages={this.state.messages} loading={this.state.loading} />
            </div>
          </div>

          <div className="chat-container__input-container">
            <input className="chat-container__input"
              onKeyPress={this._handleKeyPress}
              //setTimeout={setTimeout(this._handleKeyPress, 10000)} 
              onChange={this.onChange.bind(this)}
              value={this.state.input}
              placeholder="Type your details here ..."
            />
          </div>
        </div>
      </div>
    );
  }
}

export default ChatContainer;
