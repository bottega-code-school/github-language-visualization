import axios from "axios";
import _ from "lodash";
import Moment from "moment";
import { extendMoment } from "moment-range";
const moment = extendMoment(Moment);

const state = {
  dataLoading: true,
  repoData: []
};

const getters = {
  dataIsLoading: state => {
    return state.dataLoading;
  },

  currentRepoData: state => {
    return state.repoData;
  }
};

const mutations = {
  TURN_OFF_LOADER: state => {
    state.dataLoading = false;
  },

  POPULATE_REPO_DATA: (state, repos) => {
    state.repoData = repos;
  }
};

const actions = {
  getData: (context, filterObject) => {
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

        context.commit("POPULATE_REPO_DATA", visualizationDataObject);
        context.commit("TURN_OFF_LOADER");
      })
      .catch(error => {
        console.log(error);
      });
  }
};

export default {
  state,
  getters,
  mutations,
  actions
};
