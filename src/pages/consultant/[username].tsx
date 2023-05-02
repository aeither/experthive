import Link from "next/link";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { MakeDealButton } from "~/components/consultant/make-deal-button";
import { PieceDeals } from "~/components/consultant/piece-deals";
import PortfolioGrid from "~/components/shared/portfolio-grid";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import BookingDialog from "~/components/user/booking-dialog";
import { useDB } from "~/hooks/use-db";
import { shortenEthAddress } from "~/lib/utils";

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
  const [activeCallId, setActiveCallId] = useState<string | null>(null);
  const router = useRouter();
  const { username } = router.query;
  const { myCalls } = useDB();
  console.log("🚀 ~ file: [username].tsx:65 ~ UserPage ~ myCalls:", myCalls);

  const handleReject = (id: string) => {
    console.log(`Rejected call with ID ${id}`);
  };

  const handleStartCall = (id: string) => {
    console.log(`Started call with ID ${id}`);
    setActiveCallId(id);
  };

  const handleCompleteCall = (id: string) => {
    console.log(`Completed call with ID ${id}`);
    setActiveCallId(null);
  };

  return (
    <div className="mx-auto max-w-lg">
      <div className="mb-8 flex items-center">
        <img
          src="/user_avatar.svg"
          alt="Avatar"
          className="mr-4 h-16 w-16 rounded-full"
        />
        <div className="flex flex-col items-start gap-2">
          <p className="text-lg font-medium text-gray-800">
            {shortenEthAddress(username as string)}
          </p>
          {/* <p className="text-gray-500">{username}</p> */}
          <BookingDialog />
          <MakeDealButton />
          <PieceDeals />
        </div>
      </div>

      <h2 className="mb-4 text-lg font-medium text-gray-800">Calls</h2>
      <div className="grid grid-cols-2 gap-4 pb-4">
        {myCalls &&
          myCalls.map((item) => (
            <div
              key={item.data.id}
              className="flex w-full flex-col rounded-lg border bg-white p-4 hover:shadow-md"
            >
              <div>
                <Badge variant="outline">{item.data.status}</Badge>
              </div>

              <h3 className="mb-2 text-lg font-medium text-gray-800">
                {item.data.title}
              </h3>
              <p className="text-gray-500">{item.data.room}</p>
              <p className="text-gray-600">{item.data.date}</p>
              <p className="mb-4 text-gray-600">{item.data.description}</p>
              {activeCallId !== item.data.id ? (
                <div className="flex w-full flex-col gap-2">
                  <Button
                    variant={"destructive"}
                    onClick={() => handleReject(item.data.id)}
                  >
                    Reject
                  </Button>
                  <div className="flex w-full">
                    <Link className="w-full" href={`/rec/${item.data.room}`}>
                      <Button
                        className="w-full"
                        // onClick={() => handleStartCall(item.data.room)}
                      >
                        Start
                      </Button>
                    </Link>
                  </div>
                </div>
              ) : (
                <Button
                  variant={"destructive"}
                  onClick={() => handleCompleteCall(item.data.id)}
                >
                  Complete
                </Button>
              )}
            </div>
          ))}
      </div>

      <PortfolioGrid />
    </div>
  );
};

export default UserPage;
