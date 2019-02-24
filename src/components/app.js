import React, { Component } from "react";
import axios from "axios";
import moment from "moment";

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
      followers: [],
      startDate: moment().subtract(1, "year"),
      endDate: moment(),
      shouldRefreshData: false,
      usernameNotFound: ""
    };

    this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
    this.handleUsernameSearch = this.handleUsernameSearch.bind(this);
    this.handleDateRangeFilter = this.handleDateRangeFilter.bind(this);
  }

  refreshData() {
    this.setState({
      shouldRefreshData: true
    });
  }

  handleDateRangeFilter(dateObject) {
    this.setState({
      startDate: moment(dateObject.min),
      endDate: moment(dateObject.max)
    });

    this.refreshData();
  }

  getFollowers() {
    // Add pagination with infinite scroll
    // Needs to be able to concat new records and not replace the current list
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
      currentUsername: username,
      usernameNotFound: ""
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
        this.setState({
          usernameNotFound: username
        });
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
    if (this.state.usernameNotFound) {
      return (
        <div className="loading">
          <Search
            handleUsernameSearch={this.handleUsernameSearch}
            username={this.state.currentUsername}
          />
          <h2>
            It looks like GitHub doesn't have a user with the username:{" "}
            {this.state.usernameNotFound}. Please try again.
          </h2>
        </div>
      );
    }

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
              startDate={this.state.startDate}
              endDate={this.state.endDate}
              refreshData={this.state.shouldRefreshData}
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

          <DateRangeSlider
            defaultStartDate={this.state.startDate}
            defaultEndDate={this.state.endDate}
            handleDateRangeFilter={dateObj =>
              this.handleDateRangeFilter(dateObj)}
          />

          <Profile profile={this.state.profileData} />

          <div className="bar-chart-wrapper">
            <StackedBarChart
              width={this.state.width - 100}
              height={400}
              username={this.state.currentUsername}
              startDate={this.state.startDate}
              endDate={this.state.endDate}
              refreshData={this.state.shouldRefreshData}
            />
          </div>

          {followerCharts && followerCharts.length > 0 ? (
            <div className="follower-charts">
              <div className="follower-wrapper-heading">
                <FontAwesomeIcon icon="users" />
                <span className="text">
                  {this.state.currentUsername}'s follower data
                </span>
              </div>
              {followerCharts}
            </div>
          ) : null}
        </div>
      </div>
    );
  }
}
