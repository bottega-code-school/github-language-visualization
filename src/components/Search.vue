<template>
  <div class="search-form-wrapper">
    <form @submit.prevent="handleSearch" class="search-wrapper">
      <input v-model="username" type="text">
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