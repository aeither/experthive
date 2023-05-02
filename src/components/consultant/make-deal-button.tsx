import { ethers } from "ethers";
import * as React from "react";
import { useSigner } from "wagmi";
import { dealAbi } from "~/lib/dealAbi";
const CID = require("cids");

export function MakeDealButton() {
  const contractAddress = "0x1bA66abC13f50d806B39CC7C831a308007a84B4A";
  const { data: signer } = useSigner();

  const [txSubmitted, setTxSubmitted] = React.useState("");
  const [proposingDeal, setProposingDeal] = React.useState(false);

  const commP =
    "baga6ea4seaqcrcfn7rihufnoamqtcd76ghg34mmvteyqzi4sakwnve7akrrtwpq";
  const cid = new CID(commP);

  const carLink =
    "https://data-depot.lighthouse.storage/api/download/download_car?fileId=862fb115-d24a-4ff1-a1c8-eadbbbfd19cf.car";
  const carSize = "18445";
  const pieceSize = "32768";

  const makeDeal = async () => {
    if (!signer) return;

    const dealClient = new ethers.Contract(contractAddress, dealAbi, signer);
    const extraParamsV1 = [
      carLink,
      carSize,
      false, // taskArgs.skipIpniAnnounce,
      false, // taskArgs.removeUnsealedCopy
    ];
    const DealRequestStruct = [
      cid.bytes, //cidHex
      pieceSize, //taskArgs.pieceSize,
      false, //taskArgs.verifiedDeal,
      commP, //taskArgs.label,
      520000, // startEpoch
      1555200, // endEpoch
      0, // taskArgs.storagePricePerEpoch,
      0, // taskArgs.providerCollateral,
      0, // taskArgs.clientCollateral,
      1, //taskArgs.extraParamsVersion,
      extraParamsV1,
    ];
    // console.log(await provider.getBalance("0x42c930a33280a7218bc924732d67dd84d6247af4"));
    console.log(dealClient.interface);
    const transaction = await dealClient.makeDealProposal(DealRequestStruct);
    console.log("Proposing deal...");
    setProposingDeal(true);
    const receipt = await transaction.wait();
    console.log(receipt);
    setProposingDeal(false);
    setTxSubmitted("Transaction submitted! " + receipt.hash);
  };

  // const { config, error, isError } = usePrepareContractWrite({
  //   address: contractAddress,
  //   abi: dealAbi,
  //   functionName: "makeDealProposal",
  //   args: [
  //     {
  //       piece_cid: cid,
  //       piece_size: BigNumber.from("2048"),
  //       verified_deal: false,
  //       label: commP,
  //       start_epoch: BigNumber.from("520000"),
  //       end_epoch: BigNumber.from("1555200"),
  //       storage_price_per_epoch: BigNumber.from("0"),
  //       provider_collateral: BigNumber.from("0"),
  //       client_collateral: BigNumber.from("0"),
  //       extra_params_version: BigNumber.from("0"),
  //       extra_params: {
  //         location_ref: carLink,
  //         car_size: BigNumber.from("18445"),
  //         skip_ipni_announce: false,
  //         remove_unsealed_copy: false,
  //       },
  //     },
  //   ],
  // });
  // const { data, write } = useContractWrite(config);

  return (
    <div>
      {proposingDeal && <span>Loading...</span>}
      <div style={{ color: "green" }}> {txSubmitted} </div>
      <button onClick={makeDeal}>Make Deal</button>
      {/* <button disabled={!write} onClick={() => write && write()}>
        Make Deal
      </button>
      {isError && <div>Error: {error && error.message}</div>} */}
    </div>
  );
}
