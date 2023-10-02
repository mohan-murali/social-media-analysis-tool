import { TABLE_HEAD, TweetProps, numberOfRows } from "@/components/Dashboard";
import { FileUpload } from "@/components/FileUpload";
import Layout from "@/components/Layout";
import { Table } from "@/components/Table";
import { useAuth } from "@/hooks/useAuth";
import api from "@/utils/api";
import { useCallback, useEffect, useState } from "react";

export default function Upload() {
  const [totalPage, setTotalPage] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [data, setData] = useState([]);
  const { getAuthToken, authenticatedPage } = useAuth();
  const [showSpinner, setShowSpinner] = useState(false);

  useEffect(() => {
    authenticatedPage("/upload");
  }, [authenticatedPage]);

  useEffect(() => {
    setTotalPage(Math.ceil(total / numberOfRows));
  }, [total]);

  const fetchRecords = useCallback(
    async (skip: number, total: number) => {
      const authToken = getAuthToken();
      console.log(authToken);
      try {
        const response = await api.get(
          `tweets/user?skip=${skip}&take=${total}`,
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
    [getAuthToken]
  );

  useEffect(() => {
    fetchRecords(0, numberOfRows);
  }, []);

  const onUpload = async (file: FormData) => {
    const authToken = getAuthToken();
    try {
      setShowSpinner(true);
      await api.post("file", file, {
        headers: {
          Authorization: `bearer ${authToken}`,
        },
      });
      fetchRecords(0, numberOfRows);
    } catch (ex) {
      console.error(ex);
    } finally {
      setShowSpinner(false);
    }
  };

  const onPreviousClick = async () => {
    const skip = (currentPage - 2) * numberOfRows;
    if (fetchRecords) {
      await fetchRecords(skip, numberOfRows);
      setCurrentPage(currentPage - 1);
    }
  };

  const onNextClick = async () => {
    const skip = currentPage * numberOfRows;
    if (fetchRecords) {
      await fetchRecords(skip, numberOfRows);
      setCurrentPage(currentPage + 1);
    }
  };
  return (
    <Layout>
      <main className="flex-1 px-6 py-4 bg-gray-100">
        <h1 className="text-3xl font-semibold mb-4">Upload File</h1>
        <FileUpload onUpload={onUpload} showSpinner={showSpinner} />
      </main>
      {total > 0 && (
        <div className="flex-1 px-6 bg-gray-100">
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
        </div>
      )}
    </Layout>
  );
}
