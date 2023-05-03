const HowItWorks = () => {
  return (
    <div className="flex w-full flex-col bg-blue-600 text-white py-8">
      <h2 className="mb-8 text-center text-3xl font-bold">How it works</h2>
      <div className="mx-4 flex justify-between">
        <div className="w-full py-8 text-center md:w-1/3">
          <h3 className="mb-4 text-xl font-bold">1. Discover a Specialist</h3>
          <p className="text-lg">Find your ideal specialist in our network</p>
        </div>
        <div className="w-full py-8 text-center md:w-1/3">
          <h3 className="mb-4 text-xl font-bold">2. Schedule a Consultation</h3>
          <p className="text-lg">Connect with the specialist with Huddle01</p>
        </div>
        <div className="w-full py-8 text-center md:w-1/3">
          <h3 className="mb-4 text-xl font-bold">3. Request Resources</h3>
          <p className="text-lg">Invest in curated expertise</p>
        </div>
      </div>
    </div>
  );
};

export default HowItWorks;
