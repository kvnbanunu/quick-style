import React from "react";


export default function Welcome() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <h1 className="text-4xl font-bold mb-4">Welcome to QuickStyle Test Page!</h1>
      <p className="text-lg mb-6 text-gray-700">
        This is a simple test page to try out your components and endpoints.
      </p>

      <div className="mt-10">
        <p className="text-sm text-gray-500">
          Use the QuickStyle button to open the editor and test your endpoint.
        </p>
      </div>
    </div>
  );
}