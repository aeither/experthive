import { useCollection, usePolybase } from "@polybase/react";

import { nanoid } from "nanoid";
import toast from "react-hot-toast";
import { useAccount } from "wagmi";

export interface CallData {
  id: string;
  title: string;
  description: string;
  date: string;
  expert: string;
  participant: string;
  room: string;
  status: string;
}

export function useDB() {
  const polybase = usePolybase();
  const { address, isConnecting, isDisconnected } = useAccount();

  const myCalls = useCollection<CallData>(
    address ? polybase.collection("Call").where("expert", "==", address) : null
  );

  const saveBuyCall = async (props: Omit<CallData, "id">) => {
    const { title, description, date, expert, participant, room, status } =
      props;
    const id = nanoid(16);

    if (!address) {
      toast.error("Please sign in first to purchase the service.");
      return;
    }

    const res = await polybase
      .collection("Call")
      .create([
        id,
        title,
        description,
        date,
        expert,
        participant,
        room,
        status,
      ]);
    console.log("🚀 ~ file: use-db.ts:48 ~ saveBuyCall ~ res:", res);
    return res;
  };

  return {
    myCalls: (myCalls.data && myCalls.data.data) || undefined,
    saveBuyCall,
  };
}
