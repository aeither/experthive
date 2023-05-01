import { useRouter } from "next/router";
import React from "react";
import BookingDialog from "~/components/user/booking-dialog";
import PortfolioDialog from "~/components/user/portfolio-dialog";
import { useDB } from "~/hooks/use-db";

function shortenEthAddress(address: string) {
  if (!address || address.length < 10) {
    return address;
  }
  return address.slice(0, 4) + "..." + address.slice(-4);
}

const User = () => {
  const router = useRouter();
  const { username } = router.query;
  const { myFiles } = useDB();

  return (
    <div className="mx-auto min-h-[calc(100vh-64px)] w-full max-w-lg pt-4">
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
          <PortfolioDialog />
        </div>
      </div>
      <h2 className="mb-4 text-lg font-medium text-gray-800">Portfolio</h2>
      <div className="grid grid-cols-3 gap-4">
        {myFiles?.map((file) => (
          <div className="flex w-full rounded-lg border p-4 hover:shadow">
            {file.data.title}
          </div>
        ))}
      </div>
    </div>
  );
};

export default User;
