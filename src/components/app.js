import React, { Component } from "react";
import axios from "axios";
import _ from "lodash";
import Moment from "moment";
import { extendMoment } from "moment-range";
const moment = extendMoment(Moment);

import StackedBarChart from "./StackedBarChart";

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
      width: 0
    };

    this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
    this.handleUsernameSearch = this.handleUsernameSearch.bind(this);
  }

  getData(filterObject) {
    axios
      .get(
        `https://api.github.com/users/${filterObject.username}/repos?per_page=100&sort=updated`
      )
      .then(response => {
        var startDate = filterObject.startDate || moment().subtract(1, "year");
        var endDate = filterObject.endDate || moment();
        var dateRangeArray = Array.from(
          moment()
            .range(startDate, endDate)
            .by("month")
        );

        const filteredDateRange = response.data.filter(repo => {
          let projectCreationDate = moment(repo.created_at);
          if (
            projectCreationDate >= startDate &&
            projectCreationDate <= endDate
          ) {
            return true;
          } else {
            return false;
          }
        });

        const reposSortedByDate = filteredDateRange.sort(function compare(
          prev,
          next
        ) {
          return moment(prev.created_at) - moment(next.created_at);
        });

        const responseWithFormattedRepoDates = reposSortedByDate.map(repo => {
          repo.created_at = moment(repo.created_at)
            .startOf("month")
            .format("DD/MM/YYYY");

          return repo;
        });

        const groupByProjectCreationDate = _.groupBy(
          responseWithFormattedRepoDates,
          "created_at"
        );
        const projectCreationDataKeys = Object.keys(groupByProjectCreationDate);

        const groupByLanguage = _.groupBy(
          responseWithFormattedRepoDates,
          "language"
        );
        const languages = Object.keys(groupByLanguage);

        const projectCreationVisualizationObject = projectCreationDataKeys.map(
          date => {
            const repoCountsByLanguage = _.countBy(
              groupByProjectCreationDate[date],
              repo => {
                return repo.language;
              }
            );

            const finalDataObj = { date: date };

            languages.forEach(language => {
              if (language !== "null") {
                finalDataObj[language] = repoCountsByLanguage[language] || 0;
              }
            });

            return finalDataObj;
          }
        );

        this.setState({
          dataIsLoading: false,
          chartData: projectCreationVisualizationObject
        });
      })
      .catch(error => {
        console.log(error);
      });
  }

  handleUsernameSearch(username) {
    axios
      .get(`https://api.github.com/users/${username}`)
      .then(response => {
        this.setState({
          profileData: response.data,
          profileIsLoading: false
        });
      })
      .catch(error => {
        console.log("getUserProfileData", error);
      });
  }

  componentDidMount() {
    this.handleUsernameSearch("jordanhudgens");
    this.getData({ username: "jordanhudgens" });
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
    if (this.state.profileIsLoading || this.state.dataIsLoading) {
      return (
        <div className="loading">
          <FontAwesomeIcon icon="spinner" spin />
        </div>
      );
    }

    console.log("this.state.chartData", this.state.chartData);

    return (
      <div className="app">
        <div className="app-container">
          <Search handleUsernameSearch={this.handleUsernameSearch} />
          <Profile profile={this.state.profileData} />

          <div className="bar-chart-wrapper">
            <StackedBarChart
              width={this.state.width - 100}
              height={400}
              chartData={this.state.chartData}
            />
          </div>
        </div>
      </div>
    );
  }
}
