import React from "react";
import BookingDialog from "~/components/user/booking-dialog";

const User = () => {
  return (
    <div className="mx-auto min-h-[calc(100vh-64px)] w-full max-w-lg pt-4">
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
        <BookingDialog />
      </div>
      <h2 className="mb-4 text-lg font-medium text-gray-800">Portfolio</h2>
      <div className="grid grid-cols-3 gap-4">
        <img src="/image1.png" alt="Image 1" className="w-full" />
        <img src="/image2.png" alt="Image 2" className="w-full" />
        <img src="/image3.png" alt="Image 3" className="w-full" />
        <img src="/image4.png" alt="Image 4" className="w-full" />
        <img src="/image5.png" alt="Image 5" className="w-full" />
        <img src="/image6.png" alt="Image 6" className="w-full" />
      </div>
    </div>
  );
};

export default User;
