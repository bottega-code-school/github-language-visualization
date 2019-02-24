import React, { Component } from "react";
import axios from "axios";

import StackedBarChart from "./StackedBarChart";
import DateRangeSlider from "./DateRangeSlider";
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
  faUserCheck,
  faCalendarAlt
} from "@fortawesome/free-solid-svg-icons";

library.add(
  faSpinner,
  faPlusCircle,
  faSearch,
  faCode,
  faStickyNote,
  faUsers,
  faUserCheck,
  faCalendarAlt
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
          .currentUsername}/followers?page=1&client_id=${config.githubId}5&client_secret=${config.githubSecret}5`
      )
      .then(response => {
        this.setState({
          followers: response.data
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
        `https://api.github.com/users/${username}?client_id=${config.githubId}5&client_secret=${config.githubSecret}5`
      )
      .then(response => {
        this.setState({
          profileData: response.data,
          profileIsLoading: false,
          currentUsername: username
        });

        this.getFollowers();
      })
      .catch(error => {
        console.log("getUserProfileData", error);
      });
  }

  componentDidMount() {
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

          <DateRangeSlider />

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
