<template>
  <div class="search-wrapper">
    <form @submit.prevent="handleSearch" class="search-form">
      <input v-model="username" type="text" placeholder="GitHub Username" spellcheck="false">
      <button type="submit" class="search-button">
        <i class="fas fa-search"></i>
      </button>
    </form>
  </div>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  name: 'Search',

  data() {
    return {
      username: "jordanhudgens"
    }
  },

  methods: {
    ...mapActions([
      'getData',
      'getUserProfileData'
    ]),

    handleSearch() {
      this.getData({ username: this.username });
      this.getUserProfileData(this.username);
    }
  }
}
</script>