<template>
  <div class="profile-wrapper">
    <div class="profile-card">
      <div class="avatar">
        <img :src="profile.avatar_url" alt="avatar">
      </div>

      <pre>{{profile}}</pre>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Profile',

  props: {
    profile: Object
  },

  data() {
    return {
    }
  }
}
</script>