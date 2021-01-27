import React, { Component } from "react";

import ChatBubble from '../chatBubble/ChatBubble';
import ChoiceButton from '../choiceButton/ChoiceButton';
import Link from '../link/Link';
import Loading from '../loading/Loading';



import "./styles.css";

class ChatList extends Component {
  createMessageList = () => {
    const messages = this.props.messages;

    return messages.map((m, k) => {
      // return (
      //   <div key={k}>
      //     <>{m.type === "widget" && this.createWidget(m)}</>
      //     <>{m.type === "button" && this.createButton(m)}</>
      //     <>
      //       {(m.type === "text" || m.type === "input") && this.createBubble(m)}
      //     </>
      //     <>{m.type === "link" && this.createLink(m)}</>
      //   </div>
      // );

      if(m.type === "widget") { return this.createWidget(m)}
      else if(m.type === "button") { return this.createButton(m)}
      else if(m.type === "text" || m.type === "input") { return this.createBubble(m)}
      else if(m.type === "link") { return this.createLink(m) }
      

    });
  };

  createButton = (messageObj) => {
    return (<ChoiceButton message={messageObj} className= "chatlist__response-button"></ChoiceButton>)
  };

  createBubble = (messageObj) => {
    return (<ChatBubble message={messageObj} className={messageObj.sender === "server" ? "chatlist__chatbubble--server" :"chatlist__chatbubble--user" }></ChatBubble>);
  };

  createLink = (messageObj) => {
    return(<Link className="chatlist__link" message={messageObj}></Link>)
  };

  createWidget = (messageObj) => {
    return (
      <div className="widget">
        {/* <div className="widget__heading">{messageObj.heading}</div> */}
        <div className="widget__children">
          {messageObj.children.map((m, k) => {
            if(m.type === "widget") { return this.createWidget(m)}
            else if(m.type === "button") { return this.createButton(m)}
            else if(m.type === "text" || m.type === "input") { return this.createBubble(m)}
            else if(m.type === "link") { return this.createLink(m) }
          })}
        </div>
      </div>
    );
  };

  render() {
    return <div className="chatlist"> 
    {this.createMessageList()} 
    {this.props.loading &&  <Loading/>}
    </div>;
  }
}

export default ChatList;
