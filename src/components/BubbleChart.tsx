import React, { useEffect, useState } from "react";
import Chart from "react-google-charts";

export interface BubbleChartProps {
  data: any;
  title: string;
}

export const BubbleChart: React.FC<BubbleChartProps> = ({ data, title }) => {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const headers = ["ID", "Likes", "Retweets", "Majority Sentiment", "Count"];
    const mapped = data.map((x: any) => [
      x.hashTag,
      x.likes,
      x.retweets,
      x.negativeCount > x.positiveCount
        ? "negative"
        : x.negativeCount === x.positiveCount
        ? "neutral"
        : "positive",
      x.count,
    ]);
    //@ts-ignore
    setChartData([headers, ...mapped]);
  }, [data]);

  const options = {
    title: title,
    hAxis: { title: "Likes" },
    vAxis: { title: "Retweets" },
    bubble: { textStyle: { fontSize: 11 } },
  };

  return (
    <Chart
      chartType="BubbleChart"
      width="90%"
      height="400px"
      data={chartData}
      options={options}
    />
  );
};
