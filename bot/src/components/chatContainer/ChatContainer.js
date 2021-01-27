import React, { Component } from "react";
import { Interactions } from "aws-amplify";
import Amplify from "aws-amplify";


import "../../App.css";
import BotService from "../../services/botService";
import ChatList from "../chatList/ChatList";
import "./styles.css";

Amplify.configure({
  Auth: {
    identityPoolId: "us-east-1:69091c0c-01da-4ad9-8372-02f8635e1934",
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
    loading:false,
    input: "",
    messages: [
      {
        id:0,
        display: "Hello! I'm Travel Bot. I will help you with Booking",
        type: "text",
        sender: "server",
      },
      {
        id:1,
        display: "Let me know how can i assist you..",
        type: "text",
        sender: "server",
      },
      {
        id: 2,
        type: "widget",
        heading: "Please select an option",
       // setTimeout: setTimeout(5000),
        children: [
          {
            id: 0,
            display: "New Booking",
            value: "newflight",
            type: "button",
            clickedMsg: "I will help you with new booking. Please enter few details",
            handler: this.submitMessage.bind(this),
          },
          {
            id: 1,
            display: "Update Booking",
            value: "updateflight",
            type: "button",
            //setTimeout: setTimeout(5000),
            //handler: this.setState({loading:true}, () => this.scrolToRef()),
            //clicked: this.setState({loading:true}, () => this.scrolToRef()),
            //messages : this.setState({loading:true}, () => this.scrolToRef()),
            clickedMsg: "I will help you modify your bookings. Please enter few details",
            
            handler: this.submitMessage.bind(this),
          },
          {
            id: 2,
            display: "Cancellation",
            value: "cancelflight",
            type: "button",
            clickedMsg: "I will help you to cancel bookings. Please enter few details",
            handler: this.submitMessage.bind(this),
          },
        ],
      },
    ],
  };

  _handleKeyPress = (e) => {
    //this.setState({loading:true}, () => this.scrolToRef());
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

    this.setState({loading:true}, () => this.scrolToRef());

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
      },1000)
    }

//       this.setState(
//         {
//           messages
//         },
//         () => this.scrolToRef()
//       );
//     }



    if (message && message.value) {

    this.setState({loading:true}, () => this.scrolToRef() )

     console.log("user clicked: ",message.value);

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

      this.setState({ loading:false, messages }, () => this.scrolToRef());

      // if (message.value === "updateflight") {
      //   console.log("inside response")
      //     let messages = this.state.messages; 
      //     let currentId = messages.length;
      
      //     let msg = {};
      //     msg.id = currentId++;
      //     msg.type = "text";
      //     msg.sender = "server";
      //     msg.display = " 1st line";
      
      //     messages.push(msg);
      // }


      // When chat completes, these if-else conditions are checked
      if (response.dialogState === "ReadyForFulfillment") {
        if (response.intentName === "BookFlight_New") {
          let query = {};
          query.slots = response.slots;
          this.ndcServerResponseHandler(query);

        } else if (response.intentName === "BookFlight_Update") {
          // setTimeout(() => {
          //   this.setState({ loading:false, messages }, () => this.scrolToRef())
          // }, 5000);

          // let messages = this.state.messages;
          // let currentId = messages.length;
      
          // let msg = {};
          // msg.id = currentId++;
          // msg.type = "text";
          // msg.sender = "server";
          // msg.display = " Thanks for giving details... updating your Itinerary";
      
          // messages.push(msg);
          // setTimeout(() => {
          //   this.setState({ loading:false, messages }, () => this.scrolToRef())
          // }, 5000);

          let query = {};
          query.slots = response.slots;
          
          this.ndcServerUpdateResponseHandler(query);
          setTimeout(() => {
            this.setState({ loading:false, messages }, () => this.scrolToRef())
          }, 5000);
          

        } else if(response.intentName === "BookFlight_Cancel"){

          let messages = this.state.messages;
          let currentId = messages.length;
      
          let message = {};
          
          message.id = currentId++;
          message.type = "text";
          message.sender = "server";
          message.display = " Your booking has been cancelled";
      
          messages.push(message);

          setTimeout(() => {
            this.setState({ loading:false, messages }, () => this.scrolToRef())
          }, 1000);

        }
      }
    }
  }

  async ndcServerResponseHandler(query) {

    this.setState({loading:true}, () => this.scrolToRef() )

    let finalMessage = null;
    finalMessage = await BotService(
      query,
      "http://54.160.101.191:3003/api/UpdateFlightBooking"
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
    let messages = this.state.messages;
    let currentId = messages.length;

    let message = {};
    message.id = currentId++;
    message.type = "text";
    message.sender = "server";
    message.display = " Thanks for giving your details... fetching best fit Itinerary";

    messages.push(message);


    jsonArray.map((v, k) => {
      let message = {};
      message.id = currentId;
      message.display = `${v["airline"]} | Departure: ${v["d_time"]} | Fare: ${v["fare"]} | Duration: ${v["duration"]} (BOOK NOW)`;
      message.value = `${v["airline"]} | Departure: ${v["d_time"]} | Fare: ${v["fare"]} | Duration: ${v["duration"]}`;
      message.type = "link";
      message.sender = "ndc-server";
      message.link = "https://www.bcdtravel.com/";

      messages.push(message);
      currentId++;
    });



    setTimeout(() => {
      this.setState({ loading:false, messages }, () => this.scrolToRef())
    }, 1000);
  }
  
  // for update
  async ndcServerUpdateResponseHandler(query) {

    this.setState({loading:true}, () => this.scrolToRef() )

    let finalMessage = null;
    finalMessage = await BotService(
      query,
      "http://54.160.101.191:3003/api/UpdateFlightBooking"
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
    setTimeout(10000);
    let messages = this.state.messages;
    let currentId = messages.length;

    let msg = {};
    msg.id = currentId++;
    msg.type = "text";
    msg.sender = "server";
    msg.display = " Thanks for giving details... updating your Itinerary";

    messages.push(msg);

    setTimeout(() => {
      this.setState({ loading:false, msg }, () => this.scrolToRef())
    }, 5000);

    let msgdetails = {};
    msgdetails.id = currentId++;
    msgdetails.type = "text";
    msgdetails.sender = "server";
    msgdetails.display = " Your Modified ticket details are as follows:";

    messages.push(msgdetails);
    setTimeout(() => {
      this.setState({ loading:false, messages }, () => this.scrolToRef())
    }, 1000);

      jsonArray.map((v, k) => {
      let message = {};
      message.id = currentId;
      message.display = ` ${v["airline"]} | Departure: ${v["startdate"]} | Cabin class: ${v["cabin_class"]}  (BOOK NOW)`;
      message.value = `${v["airline"]} | Departure: ${v["startdate"]} | Cabin class: ${v["cabin_class"]}  (BOOK NOW)`;
      message.type = "link";
      message.sender = "ndc-server";
      message.link = "https://www.bcdtravel.com/";

      messages.push(message);
      currentId++;
    });


    setTimeout(() => {
      this.setState({ loading:false, messages }, () => this.scrolToRef())
    }, 5000);
    let message = {};
   //let messages = this.state.messages;
          //let currentId = messages.length;
          message.id = currentId++;
          message.type = "text";
          message.sender = "server";
          message.display = " Your booking has been updated";
      
          messages.push(message);

          setTimeout(() => {
            this.setState({ loading:false, messages }, () => this.scrolToRef())
          }, 1000);
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
            <p className="chat-container__header-title">Welcome to BCD chat!</p>
          </header>
          <div ref={this.messageContainerRef} className="chat-container__chat-list-container" >
            <div  className="chat-container__messages-container">
              <ChatList messages={this.state.messages}  loading = {this.state.loading} />
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
