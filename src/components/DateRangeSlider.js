import React, { Component } from "react";
import InputRange from "react-marker-slider";
import moment from "moment";

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

  render() {
    return (
      <form className="date-range-slider-form">
        <InputRange
          draggableTrack
          maxValue={this.state.formMax}
          minValue={this.state.formMin}
          step={25920000}
          formatLabel={value => `${moment(value).format("MMM YY")}`}
          onChange={value => this.setState({ value: value })}
          onChangeComplete={value => console.log(value)}
          value={this.state.value}
        />
      </form>
    );
  }
}
