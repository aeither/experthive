import React from "react";

const User = () => {
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
