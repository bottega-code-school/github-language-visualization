import React, { Component } from "react";
import axios from "axios";

import StackedBarChart from "./StackedBarChart";
import config from "../../config/keys";

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
      profileIsLoading: true,
      dataIsLoading: true,
      profileData: {},
      chartData: [],
      currentUsername: "jordanhudgens",
      width: 0,
      followers: []
    };

    this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
    this.handleUsernameSearch = this.handleUsernameSearch.bind(this);
  }

  getFollowers() {
    // Add pagination with infinite scroll
    axios
      .get(
        `https://api.github.com/users/${this.state
          .currentUsername}/followers?page=1&client_id=${config.githubId}&client_secret=${config.githubSecret}`
      )
      .then(response => {
        this.setState({
          followers: this.state.followers.concat(response.data)
        });
      })
      .catch(error => {
        console.log("getFollowers error", error);
      });
  }

  handleUsernameSearch(username) {
    this.setState({
      profileIsLoading: true,
      dataIsLoading: true,
      currentUsername: username
    });

    axios
      .get(
        `https://api.github.com/users/${username}?client_id=${config.githubId}&client_secret=${config.githubSecret}`
      )
      .then(response => {
        this.setState({
          profileData: response.data,
          profileIsLoading: false,
          currentUsername: username
        });
      })
      .catch(error => {
        console.log("getUserProfileData", error);
      });
  }

  componentDidMount() {
    console.log("process.env.NODE_ENV", process.env.NODE_ENV);
    console.log("process.env.all", process.env);
    console.log("githubId", config.githubId);
    console.log("githubId", config.githubSecret);
    console.log("demoEnv", config.demoEnv);
    this.handleUsernameSearch(this.state.currentUsername);
    this.getFollowers();
    this.updateWindowDimensions();
    window.addEventListener("resize", this.updateWindowDimensions);
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.updateWindowDimensions);
  }

  updateWindowDimensions() {
    this.setState({ width: window.innerWidth, height: window.innerHeight });
  }

  render() {
    if (this.state.profileIsLoading) {
      return (
        <div className="loading">
          <FontAwesomeIcon icon="spinner" spin />
        </div>
      );
    }

    const followerCharts = this.state.followers.map(follower => {
      return (
        <div className="follower-chart-item" key={follower.login}>
          <div className="follower-avatar">
            <a href={`https://github.com/${follower.login}`} target="_blank">
              <img src={follower.avatar_url} alt={follower.login} />
            </a>

            <div className="follower-username">
              <a href={`https://github.com/${follower.login}`} target="_blank">
                {follower.login}
              </a>
            </div>
          </div>

          <div className="follower-chart-wrapper">
            <StackedBarChart
              width={this.state.width - 300}
              height={400}
              username={follower.login}
            />
          </div>
        </div>
      );
    });

    return (
      <div className="app">
        <div className="app-container">
          <Search
            handleUsernameSearch={this.handleUsernameSearch}
            username={this.state.currentUsername}
          />
          <Profile profile={this.state.profileData} />

          <div className="bar-chart-wrapper">
            <StackedBarChart
              width={this.state.width - 100}
              height={400}
              username={this.state.currentUsername}
            />
          </div>

          <div className="follower-charts">{followerCharts}</div>
        </div>
      </div>
    );
  }
}
