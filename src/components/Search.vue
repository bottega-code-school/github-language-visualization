<template>
  <div class="search-wrapper">
    <form @submit.prevent="handleSearch" class="search-form">
      <input v-model="username" type="text" placeholder="GitHub Username">
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
      username: null
    }
  },

  methods: {
    ...mapActions([
      'getData'
    ]),

    handleSearch() {
      this.getData({ username: this.username });
    }
  }
}
</script>