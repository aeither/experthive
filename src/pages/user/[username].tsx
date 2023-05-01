import { useRouter } from "next/router";
import React, { useState } from "react";
import BookingDialog from "~/components/user/booking-dialog";
import PortfolioDialog from "~/components/user/portfolio-dialog";
import { FileData, useDB } from "~/hooks/use-db";
import lighthouse from "@lighthouse-web3/sdk";
import { useAccount, useSignMessage } from "wagmi";
import { verifyMessage } from "ethers/lib/utils";
import toast from "react-hot-toast";
import { Button } from "~/components/ui/button";

function shortenEthAddress(address: string) {
  if (!address || address.length < 10) {
    return address;
  }
  return address.slice(0, 4) + "..." + address.slice(-4);
}

const FileGridItem = ({ fileData }: { fileData: FileData }) => {
  const { title, hash, signedMessage } = fileData;

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
        <div>{title}</div>
        {fileURL ? (
          <a className="underline" href={fileURL} target="_blank">
            Open File
          </a>
        ) : (
          <Button onClick={() => decrypt()}>Request</Button>
        )}
      </div>
    </>
  );
};

const User = () => {
  const router = useRouter();
  const { username } = router.query;
  const { myFiles } = useDB();

  return (
    <div className="mx-auto min-h-[calc(100vh-64px)] w-full max-w-lg pt-4">
      <div className="mb-8 flex items-center">
        <img
          src="/user_avatar.svg"
          alt="Avatar"
          className="mr-4 h-16 w-16 rounded-full"
        />
        <div className="flex flex-col items-start gap-2">
          <p className="text-lg font-medium text-gray-800">
            {shortenEthAddress(username as string)}
          </p>
          {/* <p className="text-gray-500">{username}</p> */}
          <PortfolioDialog />
        </div>
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
