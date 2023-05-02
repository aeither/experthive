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

export interface FileData {
  id: string;
  title: string;
  description: string;
  signedMessage: string;
  hash: string;
  owner: string;
}

export function useDBByAddress(address: string) {
  const polybase = usePolybase();

  /**
   * File
   */
  const myFiles = useCollection<FileData>(
    address ? polybase.collection("File").where("owner", "==", address) : null
  );
  const saveFile = async (props: Omit<FileData, "id">) => {
    const { title, description, signedMessage, hash, owner } = props;
    const id = nanoid(16);

    if (!address) {
      toast.error("Please sign in first.");
      return;
    }

    const res = await polybase
      .collection("File")
      .create([id, title, description, signedMessage, hash, owner]);
    return res;
  };

  /**
   * Call
   */
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
    return res;
  };

  return {
    myCalls: (myCalls.data && myCalls.data.data) || undefined,
    saveBuyCall,
    myFiles: (myFiles.data && myFiles.data.data) || undefined,
    saveFile,
  };
}

export function useDB() {
  const polybase = usePolybase();
  const { address, isConnecting, isDisconnected } = useAccount();

  /**
   * File
   */
  const myFiles = useCollection<FileData>(
    address ? polybase.collection("File").where("owner", "==", address) : null
  );
  
  const saveFile = async (props: Omit<FileData, "id">) => {
    const { title, description, signedMessage, hash, owner } = props;
    const id = nanoid(16);

    if (!address) {
      toast.error("Please sign in first.");
      return;
    }

    const res = await polybase
      .collection("File")
      .create([id, title, description, signedMessage, hash, owner]);
    return res;
  };

  /**
   * Call
   */
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
    return res;
  };

  return {
    myCalls: (myCalls.data && myCalls.data.data) || undefined,
    saveBuyCall,
    myFiles: (myFiles.data && myFiles.data.data) || undefined,
    saveFile,
  };
}
