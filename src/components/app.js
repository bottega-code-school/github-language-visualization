import React, { Component } from "react";
// import d3 from "d3";
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
      profileIsLoading: true,
      dataIsLoading: true,
      profileData: {},
      chartData: [
        {
          label: "01/02/2018",
          values: [
            { x: "Ruby", y: 1, y0: 1 },
            { x: "JavaScript", y: 9 },
            { x: "Python", y: 2 },
            { x: "HTML", y: 1 },
            { x: "null", y: 3 }
          ]
        },
        {
          label: "01/03/2018",
          values: [
            { x: "Ruby", y: 3, y0: 1 },
            { x: "JavaScript", y: 4 },
            { x: "Python", y: 1 },
            { x: "HTML", y: 2 },
            { x: "null", y: 2 }
          ]
        },
        {
          label: "01/04/2018",
          values: [
            { x: "Ruby", y: 9, y0: 1 },
            { x: "JavaScript", y: 1 },
            { x: "Python", y: 2 },
            { x: "HTML", y: 5 },
            { x: "null", y: 1 }
          ]
        },
        {
          label: "01/05/2018",
          values: [
            { x: "Ruby", y: 1, y0: 1 },
            { x: "JavaScript", y: 3 },
            { x: "Python", y: 1 },
            { x: "HTML", y: 2 },
            { x: "null", y: 1 }
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

        const groupByProjectCreationDate = _.groupBy(
          responseWithFormattedRepoDates,
          "created_at"
        );
        const projectCreationDataKeys = Object.keys(groupByProjectCreationDate);

        const projectCreationVisualizationObject = projectCreationDataKeys.map(
          date => {
            const repoCountsByLanguage = _.countBy(
              groupByProjectCreationDate[date],
              repo => {
                return repo.language;
              }
            );

            const languageValueObject = Object.keys(
              repoCountsByLanguage
            ).map(language => {
              return {
                x: language,
                y: repoCountsByLanguage[language]
              };
            });

            return {
              label: date,
              values: languageValueObject
            };
          }
        );

        this.setState({
          dataIsLoading: false
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
  }

  tooltipConfig(x, y) {
    return "x: " + x + " y: " + y;
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

          {this.state.dataIsLoading ? (
            <FontAwesomeIcon icon="spinner" spin />
          ) : (
            <BarChart
              data={this.state.chartData}
              tooltipHtml={this.tooltipConfig}
              width={1200}
              height={500}
              margin={{ top: 10, bottom: 50, left: 50, right: 10 }}
            />
          )}
        </div>
      </div>
    );
  }
}
