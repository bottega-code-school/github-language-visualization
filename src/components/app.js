import React, { Component } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faSignOutAlt,
  faAt,
  faKey,
  faEdit,
  faTrash,
  faSpinner,
  faPlusCircle,
  faSearch,
  faCode,
  faStickyNote,
  faUsers,
  faUserCheck
} from "@fortawesome/free-solid-svg-icons";

library.add(
  faSignOutAlt,
  faAt,
  faKey,
  faTrash,
  faEdit,
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

// <AreaChart />

export default class App extends Component {
  constructor() {
    super();

    this.state = {
      dataIsLoading: true,
      profileData: {}
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
        </div>
      </div>
    );
  }
}
