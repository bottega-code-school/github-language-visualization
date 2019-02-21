import React, { Component } from "react";

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
