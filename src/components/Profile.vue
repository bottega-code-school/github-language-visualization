<template>
  <div class="profile-wrapper">
    <div v-if="profile" class="profile-card">
      <div v-if="profile.avatar_url" class="avatar">
        <img :src="profile.avatar_url" alt="avatar">
      </div>

      <div class="user-data">
        <div class="name">
          <a :href="profile.html_url" target="_blank">{{profile.name}}</a>
        </div>

        <div class="bio">
          {{profile.bio}}
        </div>
      </div>

      <pre>{{profile}}</pre>
    </div>

    <div v-else class="loading-card">
      <i class="fas fa-spinner fa-spin"></i>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Profile',

  props: {
    profile: Object
  }
}
</script>