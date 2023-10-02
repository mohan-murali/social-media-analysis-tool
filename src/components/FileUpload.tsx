import { Button, Card, CardBody, Spinner } from "@material-tailwind/react";
import { ChangeEvent, useState } from "react";

export interface FileUploadProps {
  onUpload: (file: FormData) => void;
  showSpinner: boolean;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  onUpload,
  showSpinner,
}) => {
  const [selectedFile, SetSelectedFile] = useState<File | null>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      SetSelectedFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (selectedFile) {
      const formData = new FormData();
      formData.append("file", selectedFile);
      console.log(formData, selectedFile);
      await onUpload(formData);
    } else {
      console.log("No file selected");
    }
  };

  return (
    <Card className="flex rounded">
      <CardBody className="flex rounded-none">
        <input
          type="file"
          className="peer h-full text-blue-gray-700 font-sans font-normal outline outline-0 focus:outline-0 disabled:bg-blue-gray-50 disabled:border-0 transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 border focus:border-2 text-sm px-3 py-2.5 rounded-[7px] border-blue-gray-200 focus:border-blue-500"
          onChange={handleFileChange}
        />
        <Button
          className="flex items-center gap-3 ml-3"
          color="blue"
          size="sm"
          onClick={handleUpload}
        >
          {showSpinner && <Spinner className="h-4 w-4" />}
          Upload
        </Button>
      </CardBody>
    </Card>
  );
};
