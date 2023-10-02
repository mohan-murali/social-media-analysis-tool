import React, { useEffect, useState } from "react";
import Chart from "react-google-charts";

export interface ScatterChartProps {
  data: any;
}

export const ScatterChart: React.FC<ScatterChartProps> = ({ data }) => {
  const [chartData, setChartData] = useState([]);
  const [secondChartData, setSecondChartData] = useState([]);

  useEffect(() => {
    const headers = ["Keywords", "Likes", "Retweets"];
    const mapped = data.map((x: any) => [x.hashTag, x.likes, x.retweets]);
    //@ts-ignore
    setChartData([headers, ...mapped]);

    const secondHeaders = [
      "Keywords",
      "Negative Sentiment",
      "Positive Sentiment",
    ];
    const mapped2 = data.map((x: any) => [
      x.hashTag,
      x.negativeCount,
      x.positiveCount,
    ]);
    //@ts-ignore
    setSecondChartData([secondHeaders, ...mapped2]);
  }, [data]);

  const options = {
    title: "Keyword Performance",
    curveType: "function",
    legend: { position: "bottom" },
  };

  const options2 = {
    title: "Keyword Sentiments",
    curveType: "function",
    legend: { position: "bottom" },
  };

  return (
    <div className="flex items-center flex-col w-full">
      <Chart
        chartType="ScatterChart"
        width="90%"
        height="400px"
        data={chartData}
        options={options}
      />
      <Chart
        chartType="ScatterChart"
        width="90%"
        height="400px"
        data={secondChartData}
        options={options2}
      />
    </div>
  );
};
