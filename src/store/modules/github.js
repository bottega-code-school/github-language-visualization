import axios from "axios";
import _ from "lodash";
import moment from "moment";

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
        const filteredDateRange = response.data.filter(repo => {
          let projectCreationDate = moment(repo.created_at);
          var startDate =
            filterObject.startDate || moment().subtract(1, "year");
          var endDate = filterObject.endDate || moment();

          if (
            projectCreationDate >= startDate &&
            projectCreationDate <= endDate
          ) {
            return true;
          } else {
            return false;
          }
        });

        const responseWithFormattedRepoDates = filteredDateRange.map(repo => {
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

        const visualizationDataObject = dataKeys.map(language => {
          const monthlyRepoObj = _.countBy(groupByLanguage[language], function(
            repo
          ) {
            return repo.created_at;
          });

          const monthlyRepoCounts = Object.keys(monthlyRepoObj).map(date => {
            return {
              date: date,
              value: monthlyRepoObj[date]
            };
          });

          return {
            name: language,
            values: monthlyRepoCounts
          };
        });

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
