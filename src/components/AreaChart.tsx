import { useEffect, useState } from "react";
import Chart from "react-google-charts";

export interface AreaChartProps {
  data: any;
}

export const AreaChart: React.FC<AreaChartProps> = ({ data }) => {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const headers = ["Keywords", "Likes", "Retweets"];
    const mapped = data.map((x: any) => [x.hashTag, x.likes, x.retweets]);
    //@ts-ignore
    setChartData([headers, ...mapped]);
  }, [data]);

  const options = {
    chart: {
      title: "Popular keywords performance",
    },
  };

  return (
    <Chart
      chartType="AreaChart"
      width="90%"
      height="400px"
      data={chartData}
      options={options}
    />
  );
};
