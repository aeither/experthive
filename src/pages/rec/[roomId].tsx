import { useEffect, useRef, useState } from "react";

import { useEventListener, useHuddle01 } from "@huddle01/react";
import { Audio, Video } from "@huddle01/react/components";
/* Uncomment to see the Xstate Inspector */

import {
  useAudio,
  useLobby,
  useMeetingMachine,
  usePeers,
  useRecording,
  useRoom,
  useVideo,
} from "@huddle01/react/hooks";

import { useDisplayName } from "@huddle01/react/app-utils";
import { Button } from "~/components/ui/button";
import { useRouter } from "next/router";
import { useAccount, useContractRead } from "wagmi";
import { nowknownAddress } from "~/utils/constants";
import { nowknownAbi } from "~/lib/nowknownAbi";
import { useCollection, usePolybase } from "@polybase/react";
import { CallData } from "~/hooks/use-db";

if (!process.env.NEXT_PUBLIC_HUDDLE01_PROJECT_ID)
  throw new Error("NEXT_PUBLIC_HUDDLE01_PROJECT_ID not found");
const NEXT_PUBLIC_HUDDLE01_PROJECT_ID =
  process.env.NEXT_PUBLIC_HUDDLE01_PROJECT_ID;

const App = () => {
  // refs
  const videoRef = useRef<HTMLVideoElement>(null);

  const { state, send } = useMeetingMachine();

  const [roomId, setRoomId] = useState("");
  const [displayNameText, setDisplayNameText] = useState("Guest");
  const [projectId, setProjectId] = useState("");

  const { initialize } = useHuddle01();
  const { joinLobby } = useLobby();
  const {
    fetchAudioStream,
    produceAudio,
    stopAudioStream,
    stopProducingAudio,
    stream: micStream,
  } = useAudio();
  const {
    fetchVideoStream,
    produceVideo,
    stopVideoStream,
    stopProducingVideo,
    stream: camStream,
  } = useVideo();
  const { joinRoom, leaveRoom } = useRoom();
  const { peerIds, peers } = usePeers();
  const polybase = usePolybase();
  const { address } = useAccount();
  const currentCall = useCollection<CallData>(
    address ? polybase.collection("Call").where("room", "==", roomId) : null
  );
  console.log("🚀 ~ file: [roomId].tsx:64 ~ App ~ currentCall:", currentCall);

  const { data } = useContractRead({
    address: nowknownAddress,
    abi: nowknownAbi,
    functionName: "access",
    args: [address || "0x", address || "0x"],
  });
  console.log("🚀 ~ file: [roomId].tsx:64 ~ App ~ data:", data);

  // Event Listner
  useEventListener("lobby:cam-on", () => {
    if (camStream && videoRef.current) videoRef.current.srcObject = camStream;
  });

  const {
    startRecording,
    stopRecording,
    error,
    data: recordingData,
  } = useRecording();

  const { setDisplayName, error: displayNameError } = useDisplayName();

  useEventListener("room:joined", () => {
    console.log("room:joined");
  });
  useEventListener("lobby:joined", () => {
    console.log("lobby:joined");
  });

  const router = useRouter();
  useEffect(() => {
    setRoomId(router.query.roomId?.toString() || "");
    setProjectId(NEXT_PUBLIC_HUDDLE01_PROJECT_ID);

    initialize(NEXT_PUBLIC_HUDDLE01_PROJECT_ID);
  }, [router.query.roomId?.toString()]);

  useEffect(() => {
    if (joinLobby.isCallable && roomId) {
      joinLobby(roomId);
    }
  }, [joinLobby.isCallable, roomId]);

  return (
    <div className=" container grid min-h-[calc(100vh-224px)]  grid-cols-1 place-items-center">
      <div className="grid grid-cols-2 place-items-center gap-4">
        <div className="flex w-full flex-col">
          <div className="break-words">
            Joining as {JSON.stringify(state.context.displayName)}
          </div>

          <div className="flex w-full overflow-clip rounded-lg">
            <video ref={videoRef} autoPlay muted></video>
          </div>
        </div>

        <div className="flex w-full flex-col">
          {Object.values(peers)
            .filter((peer) => peer.cam)
            .map((peer) => (
              <div className="flex w-full flex-col">
                <div>{peer.role}</div>
                <div className="flex w-full flex-col overflow-clip rounded-lg">
                  <Video
                    key={peer.peerId}
                    peerId={peer.peerId}
                    track={peer.cam}
                    debug
                  />
                </div>
              </div>
            ))}
          {Object.values(peers)
            .filter((peer) => peer.mic)
            .map((peer) => (
              <Audio key={peer.peerId} peerId={peer.peerId} track={peer.mic} />
            ))}
          {/* 
          {peers.map((peer) => (
            <Video key={peerId} peerId={peerId} debug />
          ))} */}
        </div>
      </div>

      <div>
        {joinRoom.isCallable && (
          <>
            <h1 className="text font-bold">
              Prepare your mic, camera and name before join
            </h1>
            <div className="flex flex-wrap gap-4">
              <input
                type="text"
                placeholder="Your Room Id"
                value={displayNameText}
                onChange={(e) => setDisplayNameText(e.target.value)}
                className="mr-2 h-10 rounded-lg border-2 border-gray-300 bg-white px-5 pr-16 text-sm focus:outline-none"
              />
              <Button
                disabled={!setDisplayName.isCallable}
                onClick={() => {
                  setDisplayName(displayNameText);
                }}
              >
                Change Name
                {/* {`SET_DISPLAY_NAME error: ${displayNameError}`} */}
              </Button>

              {fetchVideoStream.isCallable && (
                <Button
                  disabled={!fetchVideoStream.isCallable}
                  onClick={fetchVideoStream}
                >
                  Turn on Video
                </Button>
              )}

              {fetchAudioStream.isCallable && (
                <Button
                  disabled={!fetchAudioStream.isCallable}
                  onClick={fetchAudioStream}
                >
                  Turn on Audio
                </Button>
              )}

              {stopVideoStream.isCallable && (
                <Button
                  disabled={!stopVideoStream.isCallable}
                  onClick={stopVideoStream}
                >
                  Stop Video
                </Button>
              )}

              {stopAudioStream.isCallable && (
                <Button
                  disabled={!stopAudioStream.isCallable}
                  onClick={stopAudioStream}
                >
                  Stop Audio
                </Button>
              )}

              <Button
                className="bg-blue-500"
                disabled={!joinRoom.isCallable}
                onClick={joinRoom}
              >
                Join Call
              </Button>
            </div>
          </>
        )}
        <br />

        {leaveRoom.isCallable && (
          <div className="flex w-full flex-wrap justify-center gap-4">
            {produceAudio.isCallable && (
              <Button
                disabled={!produceAudio.isCallable}
                onClick={() => produceAudio(micStream)}
              >
                Share Mic
              </Button>
            )}

            {produceVideo.isCallable && (
              <Button
                disabled={!produceVideo.isCallable}
                onClick={() => produceVideo(camStream)}
              >
                Share Cam
              </Button>
            )}

            {stopProducingAudio.isCallable && (
              <Button
                disabled={!stopProducingAudio.isCallable}
                onClick={() => stopProducingAudio()}
              >
                Stop Mic
              </Button>
            )}

            {stopProducingVideo.isCallable && (
              <Button
                disabled={!stopProducingVideo.isCallable}
                onClick={() => stopProducingVideo()}
              >
                Stop Cam
              </Button>
            )}

            {startRecording.isCallable && (
              <Button
                disabled={!startRecording.isCallable}
                onClick={() =>
                  startRecording(`${window.location.href}rec/${roomId}`)
                }
              >
                Record Meeting{/* {`START_RECORDING error: ${error}`} */}
              </Button>
            )}
            {stopRecording.isCallable && (
              <Button
                disabled={!stopRecording.isCallable}
                onClick={stopRecording}
              >
                Stop Recording
              </Button>
            )}

            <Button
              variant={"destructive"}
              disabled={!leaveRoom.isCallable}
              onClick={leaveRoom}
            >
              Leave
            </Button>
          </div>
        )}
        {/* 
        <h2 className="text-2xl">Room State</h2>
        <h3 className="break-words">{JSON.stringify(state.value)}</h3>

        <h2 className="text-2xl">Me Id</h2>
        <div className="break-words">
          {JSON.stringify(state.context.peerId)}
        </div>
        <h2 className="text-2xl">DisplayName</h2>
        <div className="break-words">
          {JSON.stringify(state.context.displayName)}
        </div>
        <h2 className="text-2xl">Recording Data</h2>
        <div className="break-words">{JSON.stringify(recordingData)}</div>

        <h2 className="text-2xl">Error</h2>
        <div className="break-words text-red-500">
          {JSON.stringify(state.context.error)}
        </div>
        <h2 className="text-2xl">Peers</h2>
        <div className="break-words">{JSON.stringify(peers)}</div>
        <h2 className="text-2xl">Consumers</h2>
        <div className="break-words">
          {JSON.stringify(state.context.consumers)}
        </div> */}
      </div>
    </div>
  );
};

export default App;
