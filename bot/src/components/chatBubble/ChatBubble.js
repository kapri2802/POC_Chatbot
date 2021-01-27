import React, { Component } from "react";
import "./styles.css";


class ChatBubble extends Component {
    message = this.props.message;

    render() {
        return (
          <>
            {this.message.display !== "" ? (
              <div {...this.props} className={`bubble ${this.props.className}`}>
                {this.message.display}
              </div>
            ) : null}
          </>
        );
    }
}

export default ChatBubble;