import { AreaChart } from "@/components/AreaChart";
import { BarChart } from "@/components/BarChart";
import { BubbleChart } from "@/components/BubbleChart";
import Layout from "@/components/Layout";
import { LineChart } from "@/components/LineChart";
import { PieChart } from "@/components/PieChart";
import { ScatterChart } from "@/components/ScatterChart";
import { useAuth } from "@/hooks/useAuth";
import api from "@/utils/api";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Input,
  Option,
  Select,
} from "@material-tailwind/react";
import { useCallback, useEffect, useState } from "react";
import ReactSlider from "react-slider";

export default function Visualisation() {
  const [searchText, setSearchText] = useState("");
  const [data, setData] = useState([]);
  const { getAuthToken, authenticatedPage } = useAuth();
  const [selectedChart, setSelectedChart] = useState("barChart");
  const [lowerData, setLowerData] = useState(0);
  const [upperData, setUpperData] = useState(15);

  useEffect(() => {
    authenticatedPage("/visualisation");
  }, [authenticatedPage]);

  const onSearchClick = () => {
    fetchRecords(lowerData, upperData - lowerData, searchText);
  };

  const onSearchInputTextChange = (e: any) => {
    setSearchText(e.target.value);
  };

  const fetchRecords = useCallback(
    async (skip: number, take: number, filter = "") => {
      const authToken = getAuthToken();
      try {
        const response = filter
          ? await api.get(
              `keyword/filter?take=${take}&skip=${skip}&filter=${filter}`,
              {
                headers: {
                  Authorization: `bearer ${authToken}`,
                },
              }
            )
          : await api.get(`keyword?take=${take}&skip=${skip}`, {
              headers: {
                Authorization: `bearer ${authToken}`,
              },
            });
        console.log(response);
        if (response.data) {
          setData(response.data);
        }
      } catch (ex) {
        console.error(ex);
      }
    },
    [getAuthToken]
  );

  useEffect(() => {
    fetchRecords(lowerData, upperData - lowerData);
  }, []);

  const onChartChange = (value: any) => {
    console.log(value);
    setSelectedChart(value);
  };

  const onClearClick = () => {
    setSearchText("");
    fetchRecords(lowerData, upperData - lowerData);
  };

  const handleSliderChange = (value: any) => {
    console.log(value);
    setLowerData(value[0]);
    setUpperData(value[1]);
    fetchRecords(value[0], value[1] - value[0], searchText);
  };

  return (
    <Layout>
      <main className="flex-1 px-6 py-4 bg-gray-100">
        <h1 className="text-3xl font-semibold mb-4">Data Visualisation</h1>
        <Card className="overflow-scroll h-full">
          <CardHeader floated={false} shadow={false} className="rounded-none">
            <div className="mb-4 mt-4 flex flex-col justify-between gap-8 md:flex-row md:items-center">
              <div className="flex w-full shrink-0 gap-2 md:w-max">
                <div className="w-full md:w-72">
                  <Input
                    label="filter"
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
                  Filter
                </Button>

                {searchText && (
                  <Button
                    className="flex items-center gap-3"
                    color="purple"
                    size="sm"
                    onClick={onClearClick}
                    variant="outlined"
                  >
                    Clear Filter
                  </Button>
                )}
              </div>
            </div>
          </CardHeader>
          <CardBody className="flex flex-col items-center">
            <div className="w-96 my-4">
              <Select
                label="Select Visualisation Type"
                value={selectedChart}
                onChange={onChartChange}
              >
                <Option value="barChart">
                  Bar Chart (Total vs Negative vs Positive)
                </Option>
                <Option value="pieChart">Pie Chart (percentage split)</Option>
                <Option value="bubbleChart">
                  Bubble Chart(likes vs retweets - positive & negative)
                </Option>
                <Option value="scatterChart">
                  Scatter Chart (Likes vs Retweets / Negative vs positive)
                </Option>
                <Option value="lineChart">
                  Line Chart(Negative vs Positive / Likes vs Retweets)
                </Option>
                <Option value="areaChart">
                  Area Chart (Likes vs Retweets)
                </Option>
              </Select>
            </div>
            <ReactSlider
              className="horizontal-slider flex items-center mb-2 h-4 w-80"
              //@ts-ignore
              defaultValue={[0, 15]}
              min={0}
              max={25}
              ariaLabel={["Lower thumb", "Upper thumb"]}
              ariaValuetext={(state: any) => `Thumb value ${state.valueNow}`}
              onAfterChange={handleSliderChange}
              thumbClassName="bg-blue-500 leading-6 h-6 w-6 text-center text-gray-300 text-xs cursor-grabbing rounded-full"
              renderThumb={(props: any, state: any) => (
                <div {...props}>{state.valueNow}</div>
              )}
              renderTrack={(props: any, state: any) => (
                <div
                  {...props}
                  className={`h-2 ${
                    state.index === 1 ? "bg-blue-500" : "bg-blue-100"
                  }`}
                />
              )}
              pearling
              minDistance={3}
            />
            {selectedChart === "barChart" && (
              <BarChart
                data={data}
                title="Popular Keywords"
                subtitle="showing the data for popular keywords and their sentiments"
              />
            )}
            {selectedChart === "pieChart" && (
              <PieChart data={data} title="Popular Keywords" />
            )}
            {selectedChart === "bubbleChart" && (
              <BubbleChart
                data={data}
                title="Keywords use compared with its likes and retweets"
              />
            )}
            {selectedChart === "scatterChart" && <ScatterChart data={data} />}
            {selectedChart === "lineChart" && <LineChart data={data} />}
            {selectedChart === "areaChart" && <AreaChart data={data} />}
          </CardBody>
        </Card>
      </main>
    </Layout>
  );
}
