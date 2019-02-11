import axios from "axios";

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
        context.commit("POPULATE_REPO_DATA", response.data);
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
