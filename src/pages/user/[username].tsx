import lighthouse from "@lighthouse-web3/sdk";
import { CollectionRecordResponse } from "@polybase/client";
import { usePolybase } from "@polybase/react";
import { ethers, utils } from "ethers";
import { verifyMessage } from "ethers/lib/utils";
import { Users } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import toast from "react-hot-toast";
import {
  useAccount,
  useContractRead,
  useContractWrite,
  usePrepareContractWrite,
  useSignMessage,
} from "wagmi";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import PortfolioDialog from "~/components/user/portfolio-dialog";
import { CallData, FileData, RequestData, useDB } from "~/hooks/use-db";
import { nowknownAbi } from "~/lib/nowknownAbi";
import { shortenEthAddress } from "~/lib/utils";
import { nowknownAddress } from "~/utils/constants";

const signAuthMessage = async () => {
  const provider = new ethers.providers.Web3Provider(window.ethereum as any);
  const signer = provider.getSigner();
  const publicKey = (await signer.getAddress()).toLowerCase();
  const messageRequested = (await lighthouse.getAuthMessage(publicKey)).data
    .message;
  const signedMessage = await signer.signMessage(messageRequested);
  return { publicKey: publicKey, signedMessage: signedMessage };
};

const FileGridItem = ({ fileData }: { fileData: FileData }) => {
  const { title, hash, signedMessage, description, users } = fileData;

  const [fileURL, setFileURL] = React.useState<string | null>(null);
  const { address } = useAccount();

  const { data, error, isLoading, signMessage, signMessageAsync, variables } =
    useSignMessage({
      onSuccess(data, variables) {
        // Verify signature when sign message succeeds
        const address = verifyMessage(variables.message, data);

        // recoveredAddress.current = address
      },
    });

  /* Decrypt file */
  const decrypt = async () => {
    if (!address) {
      toast("sign in first");
      return;
    }

    /**
     * Get Signed Message
     */
    const messageRequested = (await lighthouse.getAuthMessage(address)).data
      .message;
    const signedMessage = await signMessageAsync({ message: messageRequested });

    // Fetch file encryption key
    const cid = hash; //replace with your IPFS CID
    /*
      fetchEncryptionKey(cid, publicKey, signedMessage)
        Parameters:
          CID: CID of the file to decrypt
          publicKey: public key of the user who has access to file or owner
          signedMessage: message signed by the owner of publicKey
    */
    console.log("this isss", cid, address, signedMessage);
    const keyObject = await lighthouse.fetchEncryptionKey(
      cid,
      address,
      signedMessage
    );
    if (!keyObject || !keyObject.data || !keyObject.data.key) {
    }
    // Decrypt file
    /*
      decryptFile(cid, key, mimeType)
        Parameters:
          CID: CID of the file to decrypt
          key: the key to decrypt the file
          mimeType: default null, mime type of file
    */

    const fileType = "image/jpeg";
    const decrypted = await lighthouse.decryptFile(
      cid,
      keyObject.data.key as string,
      fileType
    );
    console.log(decrypted);
    /*
      Response: blob
    */

    // View File
    const url = URL.createObjectURL(decrypted);
    console.log(url);
    setFileURL(url);
  };

  return (
    <>
      <div className="flex w-full flex-col gap-2 rounded-lg border p-4 hover:shadow">
        <div className="text-lg font-bold">{title}</div>
        <div>{description}</div>
        {/* {users.map( (user) => (<>{}</>))} */}
      </div>
    </>
  );
};

const CallItem = ({ item }: { item: CollectionRecordResponse<CallData> }) => {
  const { address } = useAccount();
  const router = useRouter();

  const { config: startCallConfig } = usePrepareContractWrite({
    address: nowknownAddress,
    abi: nowknownAbi,
    functionName: "startCall",
    args: [
      address || "0xtest",
      (item.data.participant as `0x${string}`) || "0xtest",
    ],
  });
  const startCall = useContractWrite(startCallConfig);

  const { config: completeCallConfig } = usePrepareContractWrite({
    address: nowknownAddress,
    abi: nowknownAbi,
    functionName: "completeCall",
    args: [
      address || "0xtest",
      (item.data.participant as `0x${string}`) || "0xtest",
    ],
  });
  const completeCall = useContractWrite(completeCallConfig);
  // const handleReject = (id: string) => {
  //   console.log(`Rejected call with ID ${id}`);
  // };

  const handleStartCall = async (participant: string) => {
    if (!startCall.writeAsync) return;
    await startCall.writeAsync();

    router.push(`/rec/${item.data.room}`);
  };

  const handleCompleteCall = async (participant: string) => {
    if (!completeCall.writeAsync) return;
    await completeCall.writeAsync();
  };

  return (
    <>
      <div
        key={item.data.id}
        className="flex w-full flex-col rounded-lg border bg-white p-4 hover:shadow-md"
      >
        <div>
          <Badge variant="outline">{item.data.status}</Badge>
        </div>

        <h3 className="mb-2 text-lg font-medium text-gray-800">
          {item.data.title}
        </h3>
        <p className="text-gray-500">{item.data.room}</p>
        <p className="text-gray-600">{item.data.date}</p>
        <p className="mb-4 text-gray-600">{item.data.description}</p>
        {/* {activeCallId !== item.data.id ? ( */}
        <div className="flex w-full flex-col gap-2">
          {/* <Button
                  variant={"destructive"}
                  onClick={() => handleReject(item.data.id)}
                >
                  Reject
                </Button> */}
          <div className="flex w-full flex-col gap-2">
            {/* <Link className="w-full" href={`/rec/${item.data.room}`}> */}
            <Button
              className="w-full"
              onClick={() => handleStartCall(item.data.participant)}
            >
              Start
            </Button>
            {/* </Link> */}
            <Button
              variant={"outline"}
              onClick={() => handleCompleteCall(item.data.participant)}
            >
              Complete
            </Button>
          </div>
        </div>
        {/* ) : ( */}
        {/* <Button
                variant={"destructive"}
                // onClick={() => handleCompleteCall(item.data.id)}
              >
                Complete
              </Button> */}
        {/* )} */}
      </div>
    </>
  );
};

const User = () => {
  const router = useRouter();
  const { username } = router.query;
  const { myFiles, myCalls, myRequests } = useDB();
  const { address } = useAccount();
  const polybase = usePolybase();

  const { data } = useContractRead({
    address: nowknownAddress,
    abi: nowknownAbi,
    functionName: "earnings",
    args: [address || "0x"],
  });

  return (
    <div className="mx-auto min-h-[calc(100vh-64px)] w-full max-w-lg pt-4">
      <div className="mb-8 flex items-center">
        <img
          src="/user_avatar.svg"
          alt="Avatar"
          className="mr-4 h-16 w-16 rounded-full"
        />
        <div className="flex flex-col items-start gap-2">
          <div>
            <p className="text-lg font-medium text-gray-800">
              {shortenEthAddress(username as string)}
            </p>
            <p>
              Earnings: {ethers.utils.formatEther(data?.toString() || 0)} Eth
            </p>
          </div>
          {/* <p className="text-gray-500">{username}</p> */}
          <div className="flex gap-2">
            <PortfolioDialog />
            <Button onClick={() => {}}>Withdraw earnings</Button>
          </div>
        </div>
      </div>

      <h2 className="mb-4 text-lg font-medium text-gray-800">Calls</h2>
      <div className="grid grid-cols-2 gap-4 pb-4">
        {myCalls &&
          myCalls.map((item) => <CallItem item={item} key={item.data.id} />)}
      </div>

      <h2 className="mb-4 text-lg font-medium text-gray-800">Requests</h2>
      <div className="grid grid-cols-3 gap-4">
        {myRequests &&
          myRequests.map((item) => (
            <>
              <div
                key={item.data.id}
                className="flex w-full flex-col rounded-lg border bg-white p-4 hover:shadow-md"
              >
                <h3 className="mb-2 text-lg font-medium text-gray-800">
                  {item.data.id}
                </h3>
                <div>{shortenEthAddress(item.data.user)}</div>

                <div className="flex w-full flex-col gap-2">
                  <div className="flex w-full">
                    <Button
                      className="w-full"
                      onClick={async () => {
                        console.log(item.data);
                        const { publicKey, signedMessage } =
                          await signAuthMessage();
                        console.log(
                          "🚀 ~ file: [username].tsx:238 ~ onClick={ ~ publicKey, signedMessage:",
                          publicKey,
                          signedMessage
                        );

                        const res = await lighthouse.shareFile(
                          publicKey,
                          [item.data.user],
                          item.data.hash,
                          signedMessage
                        );

                        // await polybase
                        //   .collection("Request")
                        //   .record(item.data.id)
                        //   .call("", [
                        //     getAddressFromPublicKey(publicKey),
                        //   ]);
                        console.log(
                          "🚀 ~ file: [username].tsx:235 ~ onClick={ ~ res:",
                          res
                        );
                      }}
                    >
                      Share
                    </Button>
                  </div>
                </div>
              </div>
            </>
          ))}
      </div>

      <h2 className="mb-4 text-lg font-medium text-gray-800">Portfolio</h2>
      <div className="grid grid-cols-3 gap-4">
        {myFiles?.map((file) => (
          <FileGridItem fileData={file.data} />
        ))}
      </div>
    </div>
  );
};

export default User;
