import React, { useState } from "react";
import { MakeDealButton } from "~/components/consultant/make-deal-button";
import { PieceDeals } from "~/components/consultant/piece-deals";

type PortfolioItem = {
  id: number;
  title: string;
  description: string;
  image: string;
};

const portfolioItems: PortfolioItem[] = [
  {
    id: 1,
    title: "Project 1",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    image: "/image1.png",
  },
  {
    id: 2,
    title: "Project 2",
    description:
      "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    image: "/image2.png",
  },
  {
    id: 3,
    title: "Project 3",
    description:
      "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    image: "/image3.png",
  },
  {
    id: 4,
    title: "Project 4",
    description:
      "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
    image: "/image4.png",
  },
  {
    id: 5,
    title: "Project 5",
    description:
      "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    image: "/image5.png",
  },
  {
    id: 6,
    title: "Project 6",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    image: "/image6.png",
  },
];

const UserPage = () => {
  const [activeCallId, setActiveCallId] = useState<number | null>(null);

  const handleReject = (id: number) => {
    console.log(`Rejected call with ID ${id}`);
  };

  const handleStartCall = (id: number) => {
    console.log(`Started call with ID ${id}`);
    setActiveCallId(id);
  };

  const handleCompleteCall = (id: number) => {
    console.log(`Completed call with ID ${id}`);
    setActiveCallId(null);
  };

  return (
    <div className="mx-auto max-w-lg">
      <div className="mb-8 flex items-center">
        <img
          src="/avatar.png"
          alt="Avatar"
          className="mr-4 h-16 w-16 rounded-full"
        />
        <div>
          <p className="text-lg font-medium text-gray-800">John Doe</p>
          <p className="text-gray-500">@johndoe</p>
        </div>
        <button className="ml-auto rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600">
          Book a call
        </button>
        <MakeDealButton />
        <PieceDeals />
      </div>
      <h2 className="mb-4 text-lg font-medium text-gray-800">Portfolio</h2>
      <div className="grid grid-cols-3 gap-4">
        {portfolioItems.map((item) => (
          <div key={item.id} className="rounded-lg bg-white p-4 shadow-md">
            <img src={item.image} alt={item.title} className="mb-4 w-full" />
            <h3 className="mb-2 text-lg font-medium text-gray-800">
              {item.title}
            </h3>
            <p className="mb-4 text-gray-500">{item.description}</p>
            {activeCallId !== item.id ? (
              <div className="flex">
                <button
                  className="mr-2 rounded-md bg-red-500 px-4 py-2 text-white hover:bg-red-600"
                  onClick={() => handleReject(item.id)}
                >
                  Reject
                </button>
                <button
                  className="rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
                  onClick={() => handleStartCall(item.id)}
                >
                  Start call
                </button>
              </div>
            ) : (
              <button
                className="rounded-md bg-green-500 px-4 py-2 text-white hover:bg-green-600"
                onClick={() => handleCompleteCall(item.id)}
              >
                Complete call
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserPage;
