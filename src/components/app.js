import React, { Component } from "react";
import axios from "axios";
import moment from "moment";

import StackedBarChart from "./StackedBarChart";
import DateRangeSlider from "./DateRangeSlider";
import LanguageCloud from "./LanguageCloud";
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
  faCalendarAlt,
  faCloud
} from "@fortawesome/free-solid-svg-icons";

library.add(
  faSpinner,
  faPlusCircle,
  faSearch,
  faCode,
  faStickyNote,
  faUsers,
  faUserCheck,
  faCalendarAlt,
  faCloud
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
      followerChartWidth: 0,
      followers: [],
      startDate: moment().subtract(1, "year"),
      endDate: moment(),
      shouldRefreshData: false,
      usernameNotFound: "",
      languageTotals: {},
      languagesFormattedForWordCloud: [],
      languageCloudIsOpen: false
    };

    this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
    this.handleUsernameSearch = this.handleUsernameSearch.bind(this);
    this.handleDateRangeFilter = this.handleDateRangeFilter.bind(this);
    this.handleWordCloudClick = this.handleWordCloudClick.bind(this);
    this.updateLanguageTotals = this.updateLanguageTotals.bind(this);
    this.toggleLanguageCloud = this.toggleLanguageCloud.bind(this);
  }

  toggleLanguageCloud() {
    this.setState({
      languageCloudIsOpen: !this.state.languageCloudIsOpen
    });
  }

  updateLanguageTotals(languageArray) {
    const receivedLanguageTotals = _.countBy(
      languageArray,
      language => language
    );

    const currentLanguages = Object.keys(this.state.languageTotals);
    const currentLanguageTotals = this.state.languageTotals;

    _.forEach(receivedLanguageTotals, function(value, key) {
      if (currentLanguages.includes(key)) {
        currentLanguageTotals[key] = currentLanguageTotals[key] + value;
      } else {
        currentLanguageTotals[key] = value;
      }
    });

    const formattedTotals = _.map(currentLanguageTotals, function(value, key) {
      return {
        text: key,
        value: value
      };
    });

    this.setState({
      languageTotals: currentLanguageTotals,
      languagesFormattedForWordCloud: formattedTotals
    });
  }

  handleWordCloudClick(word) {
    console.log("handleWordCloudClick", word);
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
    axios
      .get(
        `https://api.github.com/users/${this.state
          .currentUsername}/followers?page=1&per_page=50&client_id=${config.githubId}5&client_secret=${config.githubSecret}5`
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
      usernameNotFound: "",
      languageTotals: {},
      languagesFormattedForWordCloud: []
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
    if (window.innerWidth > 500) {
      this.setState({
        width: window.innerWidth - 100,
        followerChartWidth: window.innerWidth - 300,
        height: window.innerHeight
      });
    } else {
      this.setState({
        width: window.innerWidth - 50,
        followerChartWidth: window.innerWidth - 65,
        height: window.innerHeight
      });
    }
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
              updateLanguageTotals={this.updateLanguageTotals}
              width={this.state.followerChartWidth}
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
            toggleLanguageCloud={this.toggleLanguageCloud}
          />

          <DateRangeSlider
            defaultStartDate={this.state.startDate}
            defaultEndDate={this.state.endDate}
            handleDateRangeFilter={dateObj =>
              this.handleDateRangeFilter(dateObj)}
          />

          {this.state.languageCloudIsOpen &&
          Object.keys(this.state.languageTotals).length > 0 ? (
            <LanguageCloud
              data={this.state.languagesFormattedForWordCloud}
              handleWordCloudClick={this.handleWordCloudClick}
            />
          ) : null}

          <Profile profile={this.state.profileData} />

          <div className="bar-chart-wrapper">
            <StackedBarChart
              updateLanguageTotals={this.updateLanguageTotals}
              width={this.state.width}
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
