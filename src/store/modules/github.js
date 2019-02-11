import axios from "axios";
import _ from "lodash";

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
        const dateFilteredRepos = response.data.map(repo => {
          let createdAt = new Date(repo.created_at);
          repo.created_at = new Date(
            createdAt.getFullYear(),
            createdAt.getMonth(),
            "01"
          );
          return repo;
        });

        context.commit(
          "POPULATE_REPO_DATA",
          _.groupBy(response.data, "language")
        );
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
