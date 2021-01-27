import React, { Component } from "react";
import "./styles.css";


class Link extends Component {
    message = this.props.message;

    render() {
        return (
            <div  {...this.props}>
              <a href={this.message.link} className={`link-container__link`}>{this.message.display}</a>
            </div>
          );
    }
}

export default Link;