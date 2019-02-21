import React, { Component } from "react";
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
  }

  render() {
    return (
      <div className="app">
        <div className="app-container">
          <Search />
        </div>
      </div>
    );
  }
}
