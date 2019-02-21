import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Profile = props => {
  const {
    html_url,
    avatar_url,
    name,
    login,
    bio,
    public_repos,
    public_gists,
    followers,
    following
  } = props.profile;

  return (
    <div className="profile-wrapper">
      <div className="profile-card">
        <div className="left-column">
          <div className="avatar">
            <a href={html_url} target="_blank">
              <img src={avatar_url} alt="avatar" />
            </a>
          </div>

          <div className="user-data">
            <div className="name">
              <a href={html_url} target="_blank">
                {name || login}
              </a>
            </div>

            <div className="bio">{bio}</div>
          </div>
        </div>

        <div className="user-data-cards">
          <a
            href={`https://github.com/${login}?tab=repositories`}
            target="_blank"
          >
            <div className="user-data-card">
              <FontAwesomeIcon icon="code" />
              <div className="count">{public_repos}</div>
              <div className="title">Repos</div>
            </div>
          </a>

          <a href={`https://gist.github.com/${login}`} target="_blank">
            <div className="user-data-card">
              <FontAwesomeIcon icon="sticky-note" />
              <div className="count">{public_gists}</div>
              <div className="title">Gists</div>
            </div>
          </a>

          <a href={`https://github.com/${login}?tab=followers`} target="_blank">
            <div className="user-data-card">
              <FontAwesomeIcon icon="users" />
              <div className="count">{followers}</div>
              <div className="title">Followers</div>
            </div>
          </a>

          <a href={`https://github.com/${login}?tab=following`} target="_blank">
            <div className="user-data-card">
              <FontAwesomeIcon icon="user-check" />
              <div className="count">{following}</div>
              <div className="title">Following</div>
            </div>
          </a>
        </div>
      </div>
    </div>
  );
};

export default Profile;
