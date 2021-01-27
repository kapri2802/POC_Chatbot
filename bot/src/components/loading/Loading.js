import React, { Component } from "react";

import "./styles.css";

class Loading extends Component {
    render() {
        return (
            <div className="loading">
                <span className="loading__dot loading__dot--1"></span>
                <span className="loading__dot loading__dot--2"></span>
                <span className="loading__dot loading__dot--3"></span>
            </div>
        )
    }
}


export default Loading;

