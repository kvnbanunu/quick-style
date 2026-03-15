import React from 'react';
import { getReactSourceInfo } from "../utils/reactSourceInfo";

const DeleteButton = ({ selected }) => {
  const handleDelete = async (e) => {

    const { fileName, lineNumber, columnNumber } = getReactSourceInfo(selected);

    await fetch("/api/delete-element", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        filePath: fileName,
        line_number: lineNumber,
        column_number: columnNumber+1,
      }),
    })
      .then((res) => res.json())
      .then((data) => console.log("Backend response:", data))
      .catch(console.error);
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