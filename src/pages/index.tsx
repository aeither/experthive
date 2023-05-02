import { type NextPage } from "next";
import Link from "next/link";
import Consultants from "~/components/home/consultants";
import Hero from "~/components/home/hero";
import HowItWorks from "~/components/home/how-it-works";

import { api } from "~/utils/api";

const Home: NextPage = () => {
  const hello = api.example.hello.useQuery({ text: "from tRPC" });

  return (
    <>
      <Hero />
      <HowItWorks />
      <Consultants />
    </>
  );
};

export default Home;
