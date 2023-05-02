import { useRouter } from "next/router";
import { useState } from "react";
import { MakeDealButton } from "~/components/consultant/make-deal-button";
import { PieceDeals } from "~/components/consultant/piece-deals";
import PortfolioGrid from "~/components/shared/portfolio-grid";
import BookingDialog from "~/components/user/booking-dialog";
import { useDBByAddress } from "~/hooks/use-db";
import { shortenEthAddress } from "~/lib/utils";

type PortfolioItem = {
  id: number;
  title: string;
  description: string;
  image: string;
};

const ConsultantPage = () => {
  const [activeCallId, setActiveCallId] = useState<string | null>(null);
  const router = useRouter();
  const { username } = router.query;
  const { myFiles } = useDBByAddress(username ? (username as string) : "");

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
    <div className="mx-auto min-h-[calc(100vh-184px)] max-w-lg">
      <div className="my-8 flex items-center">
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

      <PortfolioGrid expert={username as string} files={myFiles} />
    </div>
  );
};

export default ConsultantPage;
