import Image from "next/image";
import { Button } from "../ui/button";

const Hero = () => {
  return (
      <div className="container">
    <div className="flex flex-col items-center justify-between px-4 py-8 md:flex-row md:py-16">
        <div className="md:w-1/2">
          <h1 className="mb-4 text-4xl font-bold">
            Attain the necessary knowledge to thrive in your business
          </h1>
          <p className="mb-8 text-lg">
            Connecting you with the right specialist for your needs. Instantly
            connect and start making progress towards your business goals
          </p>
          <Button>Get Started</Button>
        </div>
        <div className="md:w-1/2">
          <Image
            src="/images/hero_pro.png"
            alt="Image"
            width={640}
            height={480}
            className="rounded-lg"
          />
        </div>
      </div>
    </div>
  );
};

export default Hero;
