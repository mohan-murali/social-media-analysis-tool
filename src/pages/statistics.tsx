import Layout from "@/components/Layout";
import { StatisticsContent } from "@/components/StatisticsContent";
import { useAuth } from "@/hooks/useAuth";
import api from "@/utils/api";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import {
  Button,
  Card,
  CardHeader,
  Input,
  Spinner,
  Typography,
} from "@material-tailwind/react";
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from "react";
import Chart from "react-google-charts";

export default function Statistics() {
  const [searchText, setSearchText] = useState("");
  const { getAuthToken, authenticatedPage } = useAuth();
  const [data, setData] = useState<any>({});
  const [secondData, setSecondData] = useState<any>({});
  const [chatData, setChartData] = useState([]);
  const [pieChartData, setPieChartData] = useState<any[]>([]);
  const [secondPieData, setSecondPieData] = useState<any[]>([]);
  const [isCompare, setIsCompare] = useState(false);
  const [showSpinner, setShowSpinner] = useState(false);

  useEffect(() => {
    authenticatedPage("/statistics");
  }, [authenticatedPage]);

  const getLineData = useCallback(
    (
      data: any,
      setter: Dispatch<SetStateAction<never[]>>,
      hashTag1: string,
      hashTag2: string = ""
    ) => {
      if (isCompare) {
        const headers = ["date", hashTag1, hashTag2];
        console.log(chatData);
        const lineData = chatData
          .slice(1)
          .map((x: any) => [
            x[0],
            x[1],
            data.find((element: any) => element.date == x[0])
              ? data.find((element: any) => element.date == x[0]).count
              : 0,
          ]);

        //@ts-ignore
        setter([headers, ...lineData]);
        console.log(lineData);
      } else {
        const headers = ["date", hashTag1];
        const chartData = data.map((x: any) => [x.date, x.count]);

        //@ts-ignore
        setter([headers, ...chartData]);
      }
    },
    [chatData, isCompare]
  );

  const getLineChartData = (data: any) => {
    const headers = ["date", "postivie", "negative"];
    const lineData = data.map((x: any) => [
      x.date,
      x.positiveCount,
      x.negativeCount,
    ]);

    //@ts-ignore
    return [headers, ...lineData];
  };

  const getPieChartData = (
    data: any,
    setter: Dispatch<SetStateAction<any[]>>
  ) => {
    const barData = [
      ["Sentiment", "Count"],
      ["Positive", data.positiveCount],
      ["Negative", data.negativeCount],
    ];

    setter(barData);
  };

  const fetchData = useCallback(async () => {
    const authToken = getAuthToken();
    try {
      setShowSpinner(true);
      console.log(searchText);
      const response = await api.get(
        `keyword/statistics?hashTag=${searchText}`
      );
      console.log(response);
      if (response.data) {
        if (isCompare) {
          getLineData(
            response.data.statistics,
            setChartData,
            data.hashTag,
            response.data.hashTag
          );
          setSecondData(response.data);
          getPieChartData(response.data.keyword, setSecondPieData);
          setSearchText("");
          setIsCompare(false);
        } else {
          console.log(response.data);
          getLineData(
            response.data.statistics,
            setChartData,
            response.data.hashTag
          );
          setData(response.data);
          setSearchText("");

          getPieChartData(response.data.keyword, setPieChartData);
          setIsCompare(true);
          setSecondData({});
          setSecondPieData([]);
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      setShowSpinner(false);
    }
  }, [data.hashTag, getAuthToken, getLineData, isCompare, searchText]);

  const onSearchClick = () => {
    fetchData();
  };

  const onSearchInputTextChange = (e: any) => {
    console.log(e.target.value);
    setSearchText(e.target.value);
  };

  const options = (hashtag: string) => ({
    title: `sentiment of the tweets related to ${hashtag} hashtag`,
    is3D: true,
  });

  return (
    <Layout>
      <main className="flex-1 px-6 py-4 bg-gray-100">
        <h1 className="text-3xl font-semibold mb-4">Keyword Statistics</h1>
        <Card className="overflow-scroll">
          <CardHeader floated={false} shadow={false} className="rounded-none">
            <div className="mb-4 mt-4 flex flex-col justify-between gap-8 md:flex-row md:items-center">
              <div className="flex w-full shrink-0 gap-2 md:w-max">
                <div className="w-full md:w-72">
                  <Input
                    label="search"
                    value={searchText}
                    onChange={onSearchInputTextChange}
                    icon={<MagnifyingGlassIcon className="h-5 w-5" />}
                  />
                </div>
                <Button
                  className="flex items-center gap-3"
                  color="blue"
                  size="sm"
                  onClick={onSearchClick}
                >
                  {showSpinner && <Spinner className="h-4 w-4" />}
                  {isCompare ? "Compare" : "Analyze"}
                </Button>
              </div>
            </div>
            {secondData && secondData.similarHashtags ? (
              <div className="px-4 flex flex-row">
                <Typography
                  variant="small"
                  color="blue-gray"
                  className="font-normal leading-none opacity-70 mb-4"
                >
                  Similar hashtags{" "}
                  {secondData?.similarHashtags?.map(
                    (hashtag: any) => ` ${hashtag} `
                  )}
                </Typography>
              </div>
            ) : (
              data &&
              data.similarHashtags && (
                <div className="px-4 flex flex-row">
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal leading-none opacity-70 mb-4"
                  >
                    Similar hashtags{" "}
                    {data?.similarHashtags?.map(
                      (hashtag: any) => ` ${hashtag} `
                    )}
                  </Typography>
                </div>
              )
            )}
          </CardHeader>
        </Card>
      </main>
      {chatData.length > 0 && (
        <div className="flex-1 px-6 bg-gray-100">
          <Card className="px-6 py-4 gap-8">
            <Chart
              chartType="Line"
              width="100%"
              height="400px"
              data={chatData}
            />
          </Card>
        </div>
      )}
      {secondData && secondData.keyword && data && data.keyword ? (
        <div className="flex">
          <StatisticsContent
            data={data}
            pieChartData={pieChartData}
            options={options(data.hashTag)}
            widthClass="w-2/4"
            hashTag={data.hashTag}
            lineData={getLineChartData(data.statistics)}
          />
          <StatisticsContent
            data={secondData}
            pieChartData={secondPieData}
            options={options(secondData.hashTag)}
            widthClass="w-2/4"
            hashTag={secondData.hashTag}
            lineData={getLineChartData(secondData.statistics)}
          />
        </div>
      ) : (
        data &&
        data.keyword && (
          <StatisticsContent
            data={data}
            pieChartData={pieChartData}
            options={options(data.hashTag)}
            widthClass="w-full"
            hashTag={data.hashTag}
            lineData={getLineChartData(data.statistics)}
          />
        )
      )}
    </Layout>
  );
}
