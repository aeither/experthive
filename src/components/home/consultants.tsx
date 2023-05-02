import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { useAccount } from "wagmi";
import PortfolioGrid from "../shared/portfolio-grid";

function renderStars(numStars: number) {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    if (i <= numStars) {
      stars.push(
        <svg
          key={i}
          className="mr-1 h-4 w-4 fill-current text-yellow-500"
          viewBox="0 0 24 24"
        >
          <path d="M12 2.5L9.6 8.5H3.8L8.8 12.7L6.8 18L12 14.6L17.2 18L15.2 12.7L20.2 8.5H14.4L12 2.5Z" />
        </svg>
      );
    } else {
      stars.push(
        <svg
          key={i}
          className="mr-1 h-4 w-4 fill-current text-gray-400"
          viewBox="0 0 24 24"
        >
          <path d="M12 2.5L9.6 8.5H3.8L8.8 12.7L6.8 18L12 14.6L17.2 18L15.2 12.7L20.2 8.5H14.4L12 2.5Z" />
        </svg>
      );
    }
  }
  return stars;
}

const Consultants = () => {
  const { address } = useAccount();
  const router = useRouter();
  const { username } = router.query;

  return (
    <div className="container mx-auto flex flex-col px-4 pt-4">
      <h2 className="mb-8 text-3xl font-bold">Consultants</h2>
      <div className="grid grid-cols-1 flex-wrap gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        <div className="flex h-full flex-col rounded-lg bg-white p-4 shadow-md">
          <Link href={`/consultant/${address}`}>
            <h3 className="mb-2 text-lg font-bold">Maya Singh Patel</h3>
            <div className="flex">{renderStars(5)}</div>
            <p className="text-gray-500">
              Full Stack Web Development using MERN stack
            </p>
          </Link>
        </div>
        <div className="flex h-full flex-col rounded-lg bg-white p-4 shadow-md">
          <h3 className="mb-2 text-lg font-bold">David Kim Lee</h3>
          <div className="flex">{renderStars(4)}</div>
          <p className="text-gray-500">
            Creative Graphic Design for Branding and Marketing Materials
          </p>
        </div>
        <div className="flex h-full flex-col rounded-lg bg-white p-4 shadow-md">
          <h3 className="mb-2 text-lg font-bold">Sarah Smith Johnson</h3>
          <div className="flex">{renderStars(4)}</div>
          <p className="text-gray-500">
            Professional Content Writing for Websites, Blogs, and Social Media
            Platforms
          </p>
        </div>
        <div className="flex h-full flex-col rounded-lg bg-white p-4 shadow-md">
          <h3 className="mb-2 text-lg font-bold">Alex Wong Chen</h3>
          <div className="flex">{renderStars(5)}</div>
          <p className="text-gray-500">
            Custom Mobile App Development for iOS and Android Platforms using
            Flutter and Firebase Technologies
          </p>
        </div>
      </div>
    </div>
  );
};

export default Consultants;
