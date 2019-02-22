import React, { Component } from "react";
import d3 from "d3";
import { BarChart } from "react-d3-components";
import axios from "axios";
import _ from "lodash";
import Moment from "moment";
import { extendMoment } from "moment-range";
const moment = extendMoment(Moment);

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
            { x: "SomethingA", y: 10 },
            { x: "SomethingB", y: 4 },
            { x: "SomethingC", y: 3 }
          ]
        },
        {
          label: "somethingB",
          values: [
            { x: "SomethingA", y: 6 },
            { x: "SomethingB", y: 8 },
            { x: "SomethingC", y: 5 }
          ]
        },
        {
          label: "somethingC",
          values: [
            { x: "SomethingA", y: 6 },
            { x: "SomethingB", y: 8 },
            { x: "SomethingC", y: 5 }
          ]
        }
      ]
    };

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

        const groupByLanguage = _.groupBy(
          responseWithFormattedRepoDates,
          "language"
        );
        const dataKeys = Object.keys(groupByLanguage);

        const visualizationDataObject = dataKeys
          .map(language => {
            const monthlyRepoObj = _.countBy(
              groupByLanguage[language],
              repo => {
                return repo.created_at;
              }
            );

            const monthlyRepoCounts = dateRangeArray.map(date => {
              let dateFromRange = moment(date)
                .startOf("month")
                .format("DD/MM/YYYY");

              return {
                date: dateFromRange,
                value: monthlyRepoObj[dateFromRange] || 0
              };
            });

            return {
              name: language,
              values: monthlyRepoCounts
            };
          })
          .reverse();

        debugger;

        this.setState({
          chartData: visualizationDataObject
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

  tooltipConfig(x, y) {
    return "x: " + x + " y: " + y;
  }

  render() {
    if (this.state.dataIsLoading) {
      return (
        <div className="loading">
          <FontAwesomeIcon icon="spinner" spin />
        </div>
      );
    }

    this.getData({ username: "jordanhudgens" });

    return (
      <div className="app">
        <div className="app-container">
          <Search handleUsernameSearch={this.handleUsernameSearch} />
          <Profile profile={this.state.profileData} />

          <BarChart
            data={this.state.chartData}
            width={1200}
            height={500}
            tooltipHtml={this.tooltipConfig}
            margin={{ top: 10, bottom: 50, left: 50, right: 10 }}
          />
        </div>
      </div>
    );
  }
}
