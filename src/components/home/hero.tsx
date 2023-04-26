import Image from 'next/image';

const Hero = () => {
  return (
    <div className="flex flex-col md:flex-row items-center justify-between px-4 py-8 md:py-16">
      <div className="md:w-1/2">
        <h1 className="text-4xl font-bold mb-4">Title</h1>
        <p className="text-lg mb-8">Description</p>
        <input
          type="text"
          placeholder="Search"
          className="bg-gray-200 px-4 py-2 rounded-full w-full"
        />
      </div>
      <div className="md:w-1/2">
        <Image
          src="/image.jpg"
          alt="Image"
          width={640}
          height={480}
          className="rounded-lg"
        />
      </div>
    </div>
  );
};

export default Hero;
