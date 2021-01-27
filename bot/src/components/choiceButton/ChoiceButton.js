import React, { Component } from "react";
import "./styles.css";


class ChoiceButton extends Component {
    message = this.props.message;

    render() {
        return (
            <div  {...this.props}  className="choice-button-container">
              <button className={`choice-button-container__button ${this.props.className}`}
                onClick={() => {
                  this.message.handler(this.message);
                }}
              >
                {" "}
                {this.message.display}{" "}
              </button>
            </div>
          );
    }
}

export default ChoiceButton;