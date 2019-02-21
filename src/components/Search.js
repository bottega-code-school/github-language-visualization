import React, { Component } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default class Search extends Component {
  constructor(props) {
    super(props);

    this.state = {
      username: "jordanhudgens"
    };

    this.handleSearchInputChange = this.handleSearchInputChange.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
  }

  handleSearch(event) {
    this.props.handleUsernameSearch(this.state.username);
    event.preventDefault();
  }

  handleSearchInputChange() {
    this.setState({ [event.target.name]: event.target.value });
  }

  render() {
    return (
      <div className="search-wrapper">
        <form onSubmit={this.handleSearch} className="search-form">
          <input
            name="username"
            onChange={this.handleSearchInputChange}
            value={this.state.username}
            type="text"
            placeholder="GitHub Username"
            spellCheck="false"
          />

          <button type="submit" className="search-button">
            <FontAwesomeIcon icon="search" />
          </button>
        </form>
      </div>
    );
  }
}
