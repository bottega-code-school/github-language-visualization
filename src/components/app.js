import React, { Component } from "react";
import { AreaChart } from "react-d3-components";
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
            { x: 0, y: 2 },
            { x: 1.3, y: 5 },
            { x: 3, y: 6 },
            { x: 3.5, y: 6.5 },
            { x: 4, y: 6 },
            { x: 4.5, y: 6 },
            { x: 5, y: 7 },
            { x: 5.5, y: 8 }
          ]
        },
        {
          label: "somethingB",
          values: [
            { x: 0, y: 3 },
            { x: 1.3, y: 4 },
            { x: 3, y: 7 },
            { x: 3.5, y: 8 },
            { x: 4, y: 7 },
            { x: 4.5, y: 7 },
            { x: 5, y: 7.8 },
            { x: 5.5, y: 9 }
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

          <AreaChart
            data={this.state.chartData}
            width={1200}
            height={500}
            yOrientation="right"
            margin={{ top: 10, bottom: 50, left: 50, right: 10 }}
          />
        </div>
      </div>
    );
  }
}
