import React, { Component } from "react";
import d3 from "d3";
import { BarChart } from "react-d3-components";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faSpinner,
  faPlusCircle,
  faSearch,
  faCode,
  faStickyNote,
  faUsers,
  faUserCheck
} from "@fortawesome/free-solid-svg-icons";

library.add(
  faSpinner,
  faPlusCircle,
  faSearch,
  faCode,
  faStickyNote,
  faUsers,
  faUserCheck
);

import Search from "./Search";
import Profile from "./Profile";

export default class App extends Component {
  constructor() {
    super();

    this.state = {
      dataIsLoading: true,
      profileData: {},
      chartData: [
        {
          label: "somethingA",
          values: [
            { x: "SomethingA", y: 10 },
            { x: "SomethingB", y: 4 },
            { x: "SomethingC", y: 3 }
          ]
        },
        {
          label: "somethingB",
          values: [
            { x: "SomethingA", y: 6 },
            { x: "SomethingB", y: 8 },
            { x: "SomethingC", y: 5 }
          ]
        },
        {
          label: "somethingC",
          values: [
            { x: "SomethingA", y: 6 },
            { x: "SomethingB", y: 8 },
            { x: "SomethingC", y: 5 }
          ]
        }
      ]
    };

    this.handleUsernameSearch = this.handleUsernameSearch.bind(this);
  }

  handleUsernameSearch(username) {
    axios
      .get(`https://api.github.com/users/${username}`)
      .then(response => {
        this.setState({
          profileData: response.data,
          dataIsLoading: false
        });
      })
      .catch(error => {
        console.log("getUserProfileData", error);
      });
  }

  componentDidMount() {
    this.handleUsernameSearch("jordanhudgens");
  }

  tooltipConfig(x, y) {
    return "x: " + x + " y: " + y;
  }

  render() {
    if (this.state.dataIsLoading) {
      return (
        <div className="loading">
          <FontAwesomeIcon icon="spinner" spin />
        </div>
      );
    }

    return (
      <div className="app">
        <div className="app-container">
          <Search handleUsernameSearch={this.handleUsernameSearch} />
          <Profile profile={this.state.profileData} />

          <BarChart
            data={this.state.chartData}
            width={1200}
            height={500}
            tooltipHtml={this.tooltipConfig}
            margin={{ top: 10, bottom: 50, left: 50, right: 10 }}
          />
        </div>
      </div>
    );
  }
}
