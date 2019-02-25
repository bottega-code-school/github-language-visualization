import React from "react";
import WordCloud from "react-d3-cloud";

const LanguageCloud = props => {
  const fontSizeMapper = word => Math.log2(word.value) * 5;
  const rotate = word => word.value % 42;

  return (
    <div className="word-cloud-wrapper">
      <WordCloud
        font={"Titillium Web"}
        data={props.data}
        fontSizeMapper={fontSizeMapper}
        rotate={rotate}
        onWordClick={word => props.handleWordCloudClick(word)}
      />
    </div>
  );
};

export default LanguageCloud;
