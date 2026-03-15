import { getReactSourceInfo } from "../utils/reactSourceInfo";
import { storeChange, storeEdit } from "./utils/sessionStorage";

const DeleteButton = ({ selected }) => {
  const handleDelete = () => {
    const { fileName, lineNumber, columnNumber } = getReactSourceInfo(selected);
    const key = selected.dataset.qsSrc;

    selected.hidden = true;

    storeEdit(key, "delete", true);
    storeChange(key, "delete", {
      filePath: fileName,
      line_number: lineNumber,
      column_number: columnNumber + 1,
    });
  };

  return (
    <button
      onClick={handleDelete}
      className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
    >
      Delete
    </button>
  );
};

export default DeleteButton;

