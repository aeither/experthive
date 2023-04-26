const HowItWorks = () => {
    return (
      <div className="flex w-full flex-col bg-gray-100 py-8">
        <h2 className="text-3xl font-bold text-center mb-8">How it works</h2>
        <div className="flex justify-between mx-4">
          <div className="w-full md:w-1/3 text-center py-8">
            <h3 className="text-xl font-bold mb-4">Title 1</h3>
            <p className="text-lg">Description 1</p>
          </div>
          <div className="w-full md:w-1/3 text-center py-8">
            <h3 className="text-xl font-bold mb-4">Title 2</h3>
            <p className="text-lg">Description 2</p>
          </div>
          <div className="w-full md:w-1/3 text-center py-8">
            <h3 className="text-xl font-bold mb-4">Title 3</h3>
            <p className="text-lg">Description 3</p>
          </div>
        </div>
      </div>
    );
  };
  
  export default HowItWorks;
  