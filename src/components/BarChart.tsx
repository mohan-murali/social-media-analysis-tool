import { useEffect, useState } from "react";
import Chart from "react-google-charts";

export interface BarChartProps {
  data: any;
  title: string;
  subtitle: string;
}

export const BarChart: React.FC<BarChartProps> = ({
  data,
  title,
  subtitle,
}) => {
  const [barData, setBarData] = useState([]);

  useEffect(() => {
    const mapped = data.map((x: any) => [
      x.hashTag,
      x.count,
      x.negativeCount,
      x.positiveCount,
    ]);

    const headers = ["Keywords", "Total", "Total Negative", "Total Positive"];
    //@ts-ignore
    setBarData([headers, ...mapped]);
  }, [data]);

  const options = {
    chart: {
      title,
      subtitle,
    },
  };

  return (
    <Chart
      chartType="Bar"
      width="90%"
      height="400px"
      data={barData}
      options={options}
    />
  );
};
