import React, { Component } from "react";
import axios from "axios";
import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSignOutAlt,
  faAt,
  faKey,
  faEdit,
  faTrash,
  faSpinner,
  faPlusCircle,
  faSearch
} from "@fortawesome/free-solid-svg-icons";

library.add(
  faSignOutAlt,
  faAt,
  faKey,
  faTrash,
  faEdit,
  faSpinner,
  faPlusCircle,
  faSearch
);

import Search from "./Search";

// <Profile profile={currentProfile} />

// <AreaChart />

export default class App extends Component {
  constructor() {
    super();

    this.state = {
      profileData: {}
    };

    this.handleUsernameSearch = this.handleUsernameSearch.bind(this);
  }

  handleUsernameSearch(username) {
    axios
      .get(`https://api.github.com/users/${username}`)
      .then(response => {
        this.setState({
          profileData: response.data
        });
      })
      .catch(error => {
        console.log("getUserProfileData", error);
      });
  }

  render() {
    return (
      <div className="app">
        <div className="app-container">
          <Search handleUsernameSearch={this.handleUsernameSearch} />
        </div>
      </div>
    );
  }
}
