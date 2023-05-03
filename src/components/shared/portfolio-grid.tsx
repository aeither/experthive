import lighthouse from "@lighthouse-web3/sdk";
import { CollectionRecordResponse } from "@polybase/client";
import { utils } from "ethers";
import { verifyMessage } from "ethers/lib/utils";
import React from "react";
import toast from "react-hot-toast";
import {
  useAccount,
  useContractWrite,
  usePrepareContractWrite,
  useSignMessage,
} from "wagmi";
import { Button } from "~/components/ui/button";
import { FileData, useDB } from "~/hooks/use-db";
import { nowknownAbi } from "~/lib/nowknownAbi";
import { nowknownAddress } from "~/utils/constants";

const FileGridItem = ({
  fileData,
  expert,
}: {
  fileData: FileData;
  expert: string;
}) => {
  const { title, hash, signedMessage } = fileData;

  const [fileURL, setFileURL] = React.useState<string | null>(null);
  const { address } = useAccount();
  const { buyResource } = useDB();

  const { config } = usePrepareContractWrite({
    address: nowknownAddress,
    abi: nowknownAbi,
    functionName: "scheduleCall",
    args: [(expert as `0x${string}`) || "0xtest", address || "0xtest"],
    overrides: { value: utils.parseEther("0.01") },
  });

  const { writeAsync } = useContractWrite(config);

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
    console.log("hello decrypt");

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

  const payResource = async () => {
    if (!address) {
      toast("sign in first");
      return;
    }

    /**
     * Check if unlocked, if not. pay to contract which and wait
     */
    if (!fileData.users.includes(address)) {
      // pay contract
      if (!writeAsync) return;
      await writeAsync();

      // create new request item to db with status pending
      await buyResource({
        hash: fileData.hash,
        owner: fileData.owner,
        signedMessage: fileData.signedMessage,
        user: address,
      });

      toast("Resource Requested");
      return;
    }
  };

  return (
    <>
      <div className="flex w-full flex-col gap-2 rounded-lg border p-4 hover:shadow">
        <div>{title}</div>
        {fileURL ? (
          <a className="underline" href={fileURL} target="_blank">
            Open File
          </a>
        ) : (
          <>
            <Button onClick={async () => await payResource()}>Request</Button>
            <Button onClick={async () => await decrypt()}>Open</Button>
          </>
        )}
      </div>
    </>
  );
};

const PortfolioGrid = ({
  files,
  expert,
}: {
  files: CollectionRecordResponse<FileData>[] | undefined;
  expert: string;
}) => {
  return (
    <>
      <h2 className="mb-4 text-lg font-medium text-gray-800">Resources</h2>
      <div className="grid grid-cols-3 gap-4">
        {files?.map((file) => (
          <FileGridItem expert={expert} fileData={file.data} />
        ))}
      </div>
    </>
  );
};

export default PortfolioGrid;
