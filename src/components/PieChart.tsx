import React, { useEffect, useState } from "react";
import Chart from "react-google-charts";

export interface PieChartProps {
  data: any;
  title: string;
}

export const PieChart: React.FC<PieChartProps> = ({ data, title }) => {
  const [pieData, setPieData] = useState([]);

  useEffect(() => {
    console.log("the data is ->", data);
    const headers = ["Keywords", "Total Count"];
    const mapped = data.map((x: any) => [x.hashTag, x.count]);

    //@ts-ignore
    setPieData([headers, ...mapped]);

    console.log([headers, ...mapped]);
  }, [data]);

  const options = {
    title,
    pieSliceText: "label",
    slices: {
      4: { offset: 0.2 },
      12: { offset: 0.3 },
      14: { offset: 0.4 },
      15: { offset: 0.5 },
    },
  };

  const options2 = {
    title,
    is3D: true,
  };

  return (
    <div className="flex flex-col items-center w-full">
      <Chart
        chartType="PieChart"
        data={pieData}
        options={options}
        width={"90%"}
        height={"400px"}
      />
      <Chart
        chartType="PieChart"
        data={pieData}
        options={options2}
        width={"90%"}
        height={"400px"}
      />
    </div>
  );
};
