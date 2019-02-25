import React from "react";
import WordCloud from "react-d3-cloud";
import _ from "lodash";

const LanguageCloud = props => {
  const fontSizeMapper = word => Math.log2(word.value) * 5;
  const rotate = word => word.value % 21;

  const languageCountsSortedByCount = _.orderBy(
    props.data,
    ["value", "text"],
    ["desc", "asc"]
  );

  const languagesWithCounts = languageCountsSortedByCount.map(language => {
    return (
      <div className="language-count-item">
        <span className="text">{language.text}</span>{" "}
        <span className="value">{language.value}</span>
      </div>
    );
  });

  return (
    <div className="word-cloud-wrapper">
      <div className="word-cloud-card">
        <div className="left-column">
          <WordCloud
            width={props.width > 700 ? props.width - 400 : props.width}
            height={600}
            font={"Titillium Web"}
            data={props.data}
            fontSizeMapper={fontSizeMapper}
            rotate={rotate}
            onWordClick={word => props.handleWordCloudClick(word)}
          />
        </div>

        <div className="right-column">
          <div className="title"># of Projects per Language</div>

          <div className="language-breakdown">{languagesWithCounts}</div>
        </div>
      </div>
    </div>
  );
};

export default LanguageCloud;
