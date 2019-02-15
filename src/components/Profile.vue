<template>
  <div class="profile-wrapper">
    <div v-if="profile" class="profile-card">
      <div class="left-column">
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
      </div>

      <div class="user-data-cards">
        <div class="user-data-card">
          <div class="count">294</div>
          <div class="title">Repos</div>
        </div>

        <div class="user-data-card">
          <div class="count">390</div>
          <div class="title">Gists</div>
        </div>

        <div class="user-data-card">
          <div class="count">569</div>
          <div class="title">Followers</div>
        </div>

        <div class="user-data-card">
          <div class="count">7</div>
          <div class="title">Following</div>
        </div>

        <!-- "public_repos": 294, "public_gists": 390, "followers": 569, "following": 7, -->
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