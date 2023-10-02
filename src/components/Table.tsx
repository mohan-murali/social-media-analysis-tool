import {
  Button,
  Card,
  CardBody,
  CardFooter,
  Spinner,
  Typography,
} from "@material-tailwind/react";

interface TableProps {
  headers: string[];
  rows: {
    [key: string]: any;
  }[];
  primary: string;
  total: number;
  isLoading: boolean;
  currentPage: number;
  totalPage: number;
  onPreviousClick: () => void;
  onNextClick: () => void;
}

export const Table: React.FC<TableProps> = ({
  headers,
  rows,
  total,
  primary,
  isLoading,
  currentPage,
  totalPage,
  onNextClick,
  onPreviousClick,
}) => {
  return (
    <Card>
      <CardBody className="overflow-scroll">
        <table className="table-auto text-left">
          <thead>
            <tr>
              {headers.map((head) => (
                <th
                  key={head}
                  className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-4"
                >
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal leading-none opacity-70"
                  >
                    {head}
                  </Typography>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <div className="flex items-end gap-8">
                <Spinner className="h-8 w-8" />
              </div>
            ) : (
              rows.map((row, index) => {
                const isLast = index === rows.length - 1;
                const classes = isLast
                  ? "p-4 h-16 max-h-16"
                  : "p-4 border-b border-blue-gray-50";

                return (
                  <tr className="max-h-16 h-16 min-h-16" key={index}>
                    {Object.keys(row).map((key, index) => {
                      return (
                        <td
                          key={index}
                          className={`${classes} ${
                            key === "text" ? "w-[57rem]" : ""
                          }`}
                        >
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-normal h-16 overflow-hidden"
                          >
                            {
                              // @ts-ignore
                              row[headers[index]?.toLocaleLowerCase()]
                            }
                          </Typography>
                        </td>
                      );
                    })}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </CardBody>
      <CardFooter className="flex items-center justify-between border-t border-blue-gray-50 p-4">
        <Button
          disabled={currentPage === 1}
          variant="outlined"
          color="blue-gray"
          size="sm"
          onClick={onPreviousClick}
        >
          Previous
        </Button>
        <div className="flex items-center">
          {`Page ${currentPage} of ${totalPage}`}
        </div>
        <div>
          {`total number of records are ${total}`}
          <Button
            disabled={currentPage === totalPage || currentPage > totalPage}
            variant="outlined"
            color="blue-gray"
            size="sm"
            className="ml-4"
            onClick={onNextClick}
          >
            Next
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};
