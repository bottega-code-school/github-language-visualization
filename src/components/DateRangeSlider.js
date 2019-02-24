import React, { Component } from "react";
import InputRange from "react-marker-slider";
import moment from "moment";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default class DateRangeSlider extends Component {
  constructor(props) {
    super(props);

    this.state = {
      formMin: moment()
        .subtract(5, "years")
        .valueOf(),
      formMax: moment().valueOf(),
      value: {
        min: moment()
          .subtract(1, "year")
          .valueOf(),
        max: moment().valueOf()
      }
    };
  }

  handleFormSubmit(e) {
    this.props.handleDateRangeFilter(this.state.value);
    e.preventDefault();
  }

  render() {
    return (
      <form
        className="date-range-slider-form"
        onSubmit={e => this.handleFormSubmit(e)}
      >
        <div className="grid">
          <InputRange
            draggableTrack
            maxValue={this.state.formMax}
            minValue={this.state.formMin}
            step={25920000}
            formatLabel={value => `${moment(value).format("MMM 'YY")}`}
            onChange={value => this.setState({ value: value })}
            value={this.state.value}
          />

          <button className="btn">
            <span className="text">Filter by Date</span>
            <FontAwesomeIcon icon="calendar-alt" />
          </button>
        </div>
      </form>
    );
  }
}
