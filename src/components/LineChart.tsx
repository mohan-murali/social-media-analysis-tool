import { useEffect, useState } from "react";
import Chart from "react-google-charts";

export interface LineChartProps {
  data: any;
}

export const LineChart: React.FC<LineChartProps> = ({ data }) => {
  const [chartData, setChartData] = useState([]);
  const [secondChartData, setSecondChartData] = useState([]);

  useEffect(() => {
    const mapped = data.map((x: any) => [
      x.hashTag,
      x.negativeCount,
      x.positiveCount,
    ]);

    const headers = ["Keywords", "Total Negative", "Total Positive"];
    //@ts-ignore
    setChartData([headers, ...mapped]);

    const headers2 = ["Keywords", "Likes", "Retweets"];
    const mapped2 = data.map((x: any) => [x.hashTag, x.likes, x.retweets]);
    //@ts-ignore
    setSecondChartData([headers2, ...mapped2]);
  }, [data]);

  const options = {
    chart: {
      title: "Popular keywords sentiment",
      subtitle: "Positive vs Negative",
    },
  };

  const options2 = {
    chart: {
      title: "Popular keywords performance",
      subtitle: "Likes vs Retweets",
    },
  };

  return (
    <div className="flex items-center flex-col w-full">
      <Chart
        chartType="Line"
        width="90%"
        height="400px"
        data={chartData}
        options={options}
      />
      <Chart
        chartType="Line"
        width="90%"
        height="400px"
        data={secondChartData}
        options={options2}
      />
    </div>
  );
};
