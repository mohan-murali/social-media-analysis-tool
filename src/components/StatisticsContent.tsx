import { Card, Typography } from "@material-tailwind/react";
import { useEffect, useState } from "react";
import WordCloud from "react-d3-cloud";
import Chart from "react-google-charts";

export interface StatisticsContentProps {
  data: any;
  pieChartData: any;
  options: any;
  widthClass: string;
  hashTag: string;
  lineData: any;
}

export const StatisticsContent: React.FC<StatisticsContentProps> = ({
  data,
  pieChartData,
  options,
  widthClass,
  hashTag,
  lineData,
}) => {
  const [treeData, setTreeData] = useState([]);

  useEffect(() => {
    const treemap = data.tweets.map((tweet: string) => [tweet]);
    setTreeData(treemap);
  }, [data]);

  const treeOptions = {
    wordtree: {
      format: "implicit",
      word: hashTag,
    },
  };

  return (
    <div className={`${widthClass} px-6`}>
      <div className="mt-4 bg-gray-100">
        <Card className="px-6 py-4 gap-8">
          <Typography
            variant="lead"
            color="blue-gray"
            className="font-normal leading-none opacity-70 mb-4"
          >
            {`Most used words for ${hashTag}`}
          </Typography>
          <WordCloud
            data={data.positiveKeywordAndCount}
            height={400}
            font="Times"
            fontStyle="italic"
            fontWeight="bold"
            fontSize={(word) => Math.log2(word.value) * 5}
            onWordMouseOver={(event, d) => {
              console.log(`onWordMouseOver: ${d.text}`);
            }}
            onWordMouseOut={(event, d) => {
              console.log(`onWordMouseOut: ${d.text}`);
            }}
          />
        </Card>
      </div>
      <div className="mt-4 bg-gray-100">
        <Card className="px-6 py-4 gap-8">
          <Chart chartType="Line" width="100%" height="400px" data={lineData} />
        </Card>
      </div>
      <div className="mt-4 bg-gray-100">
        <Card className="px-6 py-4 gap-8">
          <Typography
            variant="lead"
            color="blue-gray"
            className="font-normal leading-none opacity-70 mb-4"
          >
            {`Total positive tweets for ${hashTag} are ${data.keyword.positiveCount} and Total negative tweets are ${data.keyword.negativeCount}`}
          </Typography>
        </Card>
      </div>
      <div className="mt-4 bg-gray-100">
        <Card className="px-6 py-4 gap-8">
          <Chart
            chartType="PieChart"
            options={options}
            width="100%"
            height="400px"
            data={pieChartData}
          />
        </Card>
      </div>
      <div className="mt-4 bg-gray-100">
        <Card className="px-6 py-4 gap-8">
          <Typography
            variant="lead"
            color="blue-gray"
            className="font-normal leading-none opacity-70 mb-4"
          >
            {`The most used positive keywords are `}
            <ul>
              {data?.mostUsedPositiveKeyWords?.map((hashtag: any) => {
                return <li key={hashtag}>{hashtag}</li>;
              })}
            </ul>
          </Typography>
        </Card>
      </div>
      <div className="my-4 bg-gray-100">
        <Card className="px-6 py-4 gap-8">
          <Typography
            variant="lead"
            color="blue-gray"
            className="font-normal leading-none opacity-70 mb-4"
          >
            {`The most used negative keywords are `}
            <ul>
              {data?.mostUsedNegativeKeywords?.map((hashtag: any) => {
                return <li key={hashtag}>{hashtag}</li>;
              })}
            </ul>
          </Typography>
        </Card>
      </div>
    </div>
  );
};
