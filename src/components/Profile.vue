<template>
  <div class="profile-wrapper">
    <div v-if="profile" class="profile-card">
      <div class="left-column">
        <div v-if="profile.avatar_url" class="avatar">
          <a :href="profile.html_url" target="_blank">
            <img :src="profile.avatar_url" alt="avatar">
          </a>
        </div>

        <div class="user-data">
          <div class="name">
            <a :href="profile.html_url" target="_blank">{{profile.name}}</a>
          </div>

          <div class="bio">
            {{profile.bio}}
          </div>
        </div>
      </div>

      <div class="user-data-cards">
        <a href="/">
          <div class="user-data-card">
            <i class="fas fa-code"></i>
            <div class="count">{{profile.public_repos}}</div>
            <div class="title">Repos</div>
          </div>
        </a>

        <div class="user-data-card">
          <i class="far fa-sticky-note"></i>
          <div class="count">{{profile.public_gists}}</div>
          <div class="title">Gists</div>
        </div>

        <div class="user-data-card">
          <i class="fas fa-users"></i>
          <div class="count">{{profile.followers}}</div>
          <div class="title">Followers</div>
        </div>

        <div class="user-data-card">
          <i class="fas fa-user-check"></i>
          <div class="count">{{profile.following}}</div>
          <div class="title">Following</div>
        </div>
      </div>

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