<template>
  <div class="search-form-wrapper">
    <form @submit.prevent="handleSearch">
      <input v-model="username" type="text">
      <button type="submit">Search</button>
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
      this.getData(this.username);
    }
  }
}
</script>