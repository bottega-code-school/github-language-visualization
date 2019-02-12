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
  getData: (context, username) => {
    axios
      .get(
        `https://api.github.com/users/${username}/repos?per_page=100&sort=updated`
      )
      .then(response => {
        const responseWithFormattedRepoDates = response.data.map(repo => {
          let createdAt = new Date(repo.created_at);
          repo.created_at = new Date(
            createdAt.getFullYear(),
            createdAt.getMonth(),
            "01"
          );

          repo.created_at = moment(repo.created_at).format("DD/MM/YYYY");

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
