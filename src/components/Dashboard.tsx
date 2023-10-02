import { useAuth } from "@/hooks/useAuth";
import api from "@/utils/api";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import {
  Button,
  Card,
  CardHeader,
  Input,
  Option,
  Select,
} from "@material-tailwind/react";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import { Table } from "./Table";

export const TABLE_HEAD = [
  "Name",
  "Text",
  "Sentiment",
  "Likes",
  "Retweets",
  "Location",
];

export interface TweetProps {
  name: string;
  text: string;
  sentiment: string;
  likes: string;
  retweets: string;
  location: string;
}

export interface DashboardProps {}

export const numberOfRows = 5;

export const Dashboard: React.FC<DashboardProps> = ({}) => {
  const { user, authToken, authenticatedPage } = useAuth();
  const router = useRouter();

  useEffect(() => {
    console.log(user);
    authenticatedPage();
  }, [authenticatedPage, user]);

  const [totalPage, setTotalPage] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [data, setData] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [hashTags, setHashTags] = useState([]);
  const [selectedSentiment, setSelectedSentiment] = useState("");
  const [selectedHashTag, setSelectedHashTag] = useState("");

  useEffect(() => {
    setTotalPage(Math.ceil(total / numberOfRows));
  }, [total]);

  // const fetchHashTags = useCallback(async () => {
  //   try {
  //     const response = await api.get("keyword/all", {
  //       headers: {
  //         Authorization: `bearer ${authToken}`,
  //       },
  //     });
  //     setHashTags(response.data);
  //   } catch (ex: any) {
  //     console.error(ex);
  //   }
  // }, [authToken]);

  const handleSentimentChange = (value: any) => {
    // console.log(e);
    setSelectedSentiment(value);
  };

  const onClearClick = () => {
    setSearchText("");
    setSelectedSentiment("");
    fetchRecords(0, numberOfRows);
  };

  const fetchRecords = useCallback(
    async (skip: number, total: number, filter = "", sentiment = "") => {
      try {
        const response = filter
          ? await api.post(
              `tweets/filter?skip=${skip}&take=${total}&filter=${filter}`,
              {
                sentiment: sentiment,
                hashTag: "",
              },
              {
                headers: {
                  Authorization: `bearer ${authToken}`,
                },
              }
            )
          : await api.post(
              `tweets?skip=${skip}&take=${total}`,
              {
                sentiment: sentiment,
                hashTag: "",
              },
              {
                headers: {
                  Authorization: `bearer ${authToken}`,
                },
              }
            );
        console.log(response.data);
        if (response.data) {
          setTotal(response.data.totalTweets);
          setData(
            response.data.tweets.map(
              (tweet: TweetProps): TweetProps => ({
                name: tweet.name,
                text: tweet.text,
                sentiment: tweet.sentiment,
                likes: tweet.likes,
                retweets: tweet.retweets,
                location: tweet.location,
              })
            )
          );
        }
      } catch (ex) {
        console.error(ex);
      }
    },
    [authToken]
  );

  useEffect(() => {
    fetchRecords(0, numberOfRows);
    // fetchHashTags();
  }, []);

  const onSearchInputTextChange = (e: any) => {
    setSearchText(e.target.value);
  };

  const onPreviousClick = async () => {
    const skip = (currentPage - 2) * numberOfRows;
    if (fetchRecords) {
      await fetchRecords(skip, numberOfRows, searchText, selectedSentiment);
      setCurrentPage(currentPage - 1);
    }
  };

  const onNextClick = async () => {
    const skip = currentPage * numberOfRows;
    if (fetchRecords) {
      await fetchRecords(skip, numberOfRows, searchText, selectedSentiment);
      setCurrentPage(currentPage + 1);
    }
  };

  const onSearchClick = () => {
    fetchRecords(0, numberOfRows, searchText, selectedSentiment);
  };

  return (
    <main className="flex-1 px-6 py-4 bg-gray-100">
      <h1 className="text-3xl font-semibold mb-4">Welcome {user?.name}</h1>
      <Card className="overflow-scroll h-full">
        <CardHeader floated={false} shadow={false} className="rounded-none">
          <div className="mb-4 mt-4 flex flex-col justify-between gap-8 md:flex-row md:items-center">
            <div className="flex w-full shrink-0 gap-2 md:w-max">
              <div className="w-full md:w-72">
                <Input
                  label="Search"
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
                Search
              </Button>
            </div>
            {(searchText || selectedSentiment) && (
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
        </CardHeader>
        <div className="w-full md:w-72 mx-4">
          <Select
            color="blue"
            label="Select Sentiment"
            value={selectedSentiment}
            onChange={handleSentimentChange}
          >
            <Option value="positive">Positive</Option>
            <Option value="negative">Negative</Option>
          </Select>
        </div>
        {/* <Select
          color="blue"
          label="Select HashTag"
          value={selectedSentiment}
          onChange={handleSentimentChange}
        >
          {hashTags.map((x: any) => (
            <Option key={x.id} value={x.text}>
              {x.text}
            </Option>
          ))}
        </Select> */}
        <Table
          headers={TABLE_HEAD}
          rows={data}
          total={total}
          primary="Name"
          currentPage={currentPage}
          totalPage={totalPage}
          onNextClick={onNextClick}
          onPreviousClick={onPreviousClick}
          isLoading={false}
        />
      </Card>
    </main>
  );
};
