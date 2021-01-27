import React, { Component } from "react";
import "./App.css";
import chatImg  from './chat.png';
import crossImg from './cross.png'
import backgroundImage from './BCD-SS.JPG';

import ChatContainer from "./components/chatContainer/ChatContainer";

class App extends Component {

  state ={
    chatOpen: false
  }



  render() {

    const toggleChat = () => {
      const status = this.state.chatOpen;
      this.setState({ chatOpen: !status})
    }

    return (
      <div className="App" style={{backgroundImage: "url(" + backgroundImage + ")"}}>
        {this.state.chatOpen && (
          <div className="chatBot">
            <ChatContainer />
          </div>
        )}

        {this.state.chatOpen && (
          <div className="chat-icon" onClick={toggleChat}>
            <img src={ crossImg} />
          </div>
        )}
        {!this.state.chatOpen && (
          <div className="chat-icon" onClick={toggleChat}>
            <img src={chatImg} />
          </div>
        )}
      </div>
    );
  }
}


export default App;
