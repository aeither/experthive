import { BigNumber, utils } from "ethers";
import { ChangeEvent, ChangeEventHandler, useState } from "react";
import { useForm } from "react-hook-form";
import { useAccount, useContractWrite, usePrepareContractWrite } from "wagmi";
import { useDB } from "~/hooks/use-db";
import { dealAbi } from "~/lib/dealAbi";
import { nowknownAbi } from "~/lib/nowknownAbi";
import { nowknownAddress } from "~/utils/constants";
import lighthouse from "@lighthouse-web3/sdk";
import { toast } from "react-hot-toast";
import { ethers } from "ethers";
import { useSignMessage } from "wagmi";
import { verifyMessage } from "ethers/lib/utils";
import { Button } from "../ui/button";

type FormData = {
  title: string;
  description: string;
  content: string;
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

type Output = {
  data: FileData;
};

type FileData = {
  Name: string;
  Size: number;
  Hash: string;
};

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

const PortfolioForm = () => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormData>();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { address } = useAccount();
  const [signedMessage, setSignedMessage] = useState<string>();
  const { data, error, isLoading, signMessage, signMessageAsync, variables } =
    useSignMessage({
      onSuccess(data, variables) {
        // Verify signature when sign message succeeds
        const address = verifyMessage(variables.message, data);
        setSignedMessage(data as string);

        // recoveredAddress.current = address
      },
    });

  const progressCallback = (progressData: ProgressData): void => {
    if (!progressData?.total || !progressData.uploaded) return;
    const progress =
      (progressData.total as number) / (progressData.uploaded as number);
    let percentageDone = 100 - +progress.toFixed(2);
    console.log(percentageDone);
  };

  const uploadFile = async (
    e: ChangeEvent<HTMLInputElement>
  ): Promise<void> => {
    if (!address) return;

    const messageRequested = (await lighthouse.getAuthMessage(address)).data
      .message;
    const signedMessage = await signMessageAsync({ message: messageRequested });

    const response = await lighthouse.uploadEncrypted(
      e,
      "dfcfd45c.a142c28524ac4e049453960e0dc2917b",
      address,
      signedMessage as string,
      progressCallback
    );
    console.log(response);
    toast("uploaded successfully");
    // console.log(
    //   "Visit at https://gateway.lighthouse.storage/ipfs/" + output.data.Hash
    // );
    // setValue("content", output.data.Hash);
  };

  const onSubmit = async (data: FormData) => {
    console.log(data);
    const { content, description, title } = data;

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
              Content
            </label>
            <input
              onChange={(e: ChangeEvent<HTMLInputElement>) => uploadFile(e)}
              type="file"
            />
            {errors.content && (
              <p className="mt-1 text-sm text-red-500">Date is required</p>
            )}
          </div>
          <button
            type="submit"
            className="rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
          >
            Upload
          </button>
        </form>
      ) : (
        <BookingSuccess />
      )}
    </>
  );
};

const BookingSuccess = () => {
  return (
    <div className="flex flex-col items-center justify-center">
      <img src="/success.png" alt="Success" className="mb-4 h-32 w-32" />
      <p className="mb-4 text-lg font-medium text-gray-800">
        Your booking has been confirmed!
      </p>
      <button
        className="rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
        onClick={() => window.location.reload()}
      >
        Book again
      </button>
    </div>
  );
};

export default PortfolioForm;
