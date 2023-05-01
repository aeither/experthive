import Link from "next/link";
import React from "react";

const Consultants = () => {
  return (
    <div className="container mx-auto px-4 pt-4">
      <h2 className="mb-8 text-3xl font-bold">Consultants</h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {/* Grid items */}
        <Link href={"/user/nate"}>
          <div className="rounded-lg bg-white p-4 shadow-md">
            <h3 className="mb-2 text-lg font-bold">Consultant 1</h3>
            <p className="text-gray-500">Description 1</p>
          </div>
        </Link>
        <div className="rounded-lg bg-white p-4 shadow-md">
          <h3 className="mb-2 text-lg font-bold">Consultant 2</h3>
          <p className="text-gray-500">Description 2</p>
        </div>
        <div className="rounded-lg bg-white p-4 shadow-md">
          <h3 className="mb-2 text-lg font-bold">Consultant 3</h3>
          <p className="text-gray-500">Description 3</p>
        </div>
        <div className="rounded-lg bg-white p-4 shadow-md">
          <h3 className="mb-2 text-lg font-bold">Consultant 4</h3>
          <p className="text-gray-500">Description 4</p>
        </div>
        {/* Add more grid items as needed */}
      </div>
    </div>
  );
};

export default Consultants;
