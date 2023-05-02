import { BigNumber, utils } from "ethers";
import * as React from "react";
import { dealAbi } from "~/lib/dealAbi";
import {
  usePrepareContractWrite,
  useContractWrite,
  useSigner,
  useContractRead,
} from "wagmi";
const CID = require("cids");

export function PieceDeals() {
  const [dealID, setDealID] = React.useState("");

  const commP =
    "baga6ea4seaqkp2pjlh6avlvee6ib2maanav5sc35l5glf3zm6rd6hmfgcx5xeji";
  const cid = new CID(commP);

  const carLink =
    "https://data-depot.lighthouse.storage/api/download/download_car?fileId=862fb115-d24a-4ff1-a1c8-eadbbbfd19cf.car";

  const { data, isError, isLoading } = useContractRead({
    address: "0x1bA66abC13f50d806B39CC7C831a308007a84B4A",
    abi: dealAbi,
    functionName: "pieceDeals",
    args: [cid.bytes],
  });
  if (data) {
    console.log(
      "🚀 ~ file: make-deal-button copy.tsx:28 ~ MakeDealButton ~ data:",
      data.toString()
    );
  }

  return (
    <div>
      {dealID && (
        <div style={{ color: "green", margin: "auto" }}> Deal: {dealID} </div>
      )}
    </div>
  );
}
