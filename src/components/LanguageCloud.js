import React from "react";
import WordCloud from "react-d3-cloud";

const LanguageCloud = props => {
  const data = [
    { text: "Hey", value: 1000 },
    { text: "lol", value: 200 },
    { text: "first impression", value: 800 },
    { text: "very cool", value: 1000000 },
    { text: "duck", value: 10 }
  ];

  const fontSizeMapper = word => Math.log2(word.value) * 5;
  const rotate = word => word.value % 42;

  return (
    <div className="word-cloud-wrapper">
      <WordCloud
        font={"Titillium Web"}
        data={data}
        fontSizeMapper={fontSizeMapper}
        rotate={rotate}
      />
    </div>
  );
};

export default LanguageCloud;
