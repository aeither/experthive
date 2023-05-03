import { BigNumber, utils } from "ethers";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useAccount, useContractWrite, usePrepareContractWrite } from "wagmi";
import { useDB } from "~/hooks/use-db";
import { dealAbi } from "~/lib/dealAbi";
import { nowknownAbi } from "~/lib/nowknownAbi";
import { nowknownAddress } from "~/utils/constants";
import lighthouse from "@lighthouse-web3/sdk";
import Link from "next/link";

type FormData = {
  title: string;
  description: string;
  date: string;
};

interface RoomResponse {
  title: string;
  roomLock: boolean;
  startTime: string;
  endTime: string;
  hostWallets: string[];
  createdBy: string;
  roomId: string;
  roomUrl: string;
}

type ProgressData = {
  total: number;
  uploaded: number;
};

const createRoom = async (): Promise<RoomResponse> => {
  try {
    const response = await fetch("/api/huddle/create-room");
    const data = await response.json();
    console.log(data);
    return data;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

const BookingForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { address } = useAccount();
  const [roomId, setRoomId] = useState<string>();

  const { saveBuyCall } = useDB();

  const { config, error, isError } = usePrepareContractWrite({
    address: nowknownAddress,
    abi: nowknownAbi,
    functionName: "scheduleCall",
    args: [address || "0xtest", address || "0xtest"],
    overrides: { value: utils.parseEther("0.01") },
  });

  const { data, writeAsync } = useContractWrite(config);

  const progressCallback = (progressData: ProgressData): void => {
    if (!progressData?.total || !progressData.uploaded) return;
    const progress =
      (progressData.total as number) / (progressData.uploaded as number);
    let percentageDone = 100 - +progress.toFixed(2);
    console.log(percentageDone);
  };

  const uploadFile = async (e: File): Promise<void> => {
    // Push file to lighthouse node
    // Both file and folder are supported by upload function
    const output = await lighthouse.upload(e, "YOUR_API_KEY", progressCallback);
    console.log("File Status:", output);
    /*
      output:
        data: {
          Name: "filename.txt",
          Size: 88000,
          Hash: "QmWNmn2gr4ZihNPqaC5oTeePsHvFtkWNpjY3cD6Fd5am1w"
        }
      Note: Hash in response is CID.
    */
    console.log(
      "Visit at https://gateway.lighthouse.storage/ipfs/" + output.data.Hash
    );
  };

  const onSubmit = async (data: FormData) => {
    console.log(data);
    const { date, description, title } = data;

    // make the payment to nowknown contract
    if (!writeAsync) return;
    await writeAsync();

    // create room on huddle01
    const roomData = await createRoom();

    // save data to polybase database
    await saveBuyCall({
      title,
      description,
      date,
      expert: address || "0xtest",
      participant: address || "0xtest",
      room: roomData.roomId,
      status: "Bought",
    });

    setRoomId(roomData.roomId);
    setIsSubmitted(true);
  };

  return (
    <>
      {!isSubmitted ? (
        <form onSubmit={handleSubmit(onSubmit)} className="mx-auto max-w-lg">
          <div className="mb-4">
            <label htmlFor="title" className="mb-2 block font-medium">
              Title
            </label>
            <input
              type="text"
              id="title"
              {...register("title", { required: true })}
              className={`w-full rounded-md border px-4 py-2 ${
                errors.title ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-500">Title is required</p>
            )}
          </div>
          <div className="mb-4">
            <label htmlFor="description" className="mb-2 block font-medium">
              Description
            </label>
            <textarea
              id="description"
              {...register("description", { required: true })}
              className={`w-full rounded-md border px-4 py-2 ${
                errors.description ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-500">
                Description is required
              </p>
            )}
          </div>
          <div className="mb-4">
            <label htmlFor="date" className="mb-2 block font-medium">
              Date
            </label>
            <input
              type="date"
              id="date"
              {...register("date", { required: true })}
              className={`w-full rounded-md border px-4 py-2 ${
                errors.date ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.date && (
              <p className="mt-1 text-sm text-red-500">Date is required</p>
            )}
          </div>
          <button
            type="submit"
            className="rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
          >
            Book
          </button>
        </form>
      ) : (
        <BookingSuccess roomId={roomId || ""} />
      )}
    </>
  );
};

const BookingSuccess = ({ roomId }: { roomId: string }) => {
  return (
    <div className="flex flex-col items-center justify-center">
      <img src="/images/success.png" alt="Success" className="mb-4 h-32 w-32" />
      <p className="mb-4 text-lg font-medium text-gray-800">
        Your booking has been confirmed!
      </p>
      <div className="flex w-full flex-row justify-center gap-2">
        <Link href={`/rec/${roomId}`}>
          <button className="rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600">
            Open Meeting URL
          </button>
        </Link>
        <button
          onClick={() => window.location.reload()}
          className="rounded-md bg-red-500 px-4 py-2 text-white hover:bg-blue-600"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default BookingForm;
