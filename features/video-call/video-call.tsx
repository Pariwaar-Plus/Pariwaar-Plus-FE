// components/video-call.tsx

"use client";

import { useQuery } from "@tanstack/react-query";
import { getVideoCallJoinUrl } from "./api/video-call.api";
import { JaaSMeeting } from "@jitsi/react-sdk";
import { useRouter } from "next/navigation";

export function VideoCall({ roomId }: { roomId: string }) {
  const router = useRouter();
  const {
    data,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["video-call", roomId],
    queryFn: () => getVideoCallJoinUrl(roomId),
    enabled: !!roomId,
  });
  // Pa$$w0rd!
  if (isLoading) return <div>Joining call...</div>;

  if (isError) {
    return (
      <div>
        Unable to join the call.
        {error instanceof Error && <p>{error.message}</p>}
      </div>
    );
  }

  if (!data?.appId || !data?.room || !data?.jwt) {
    return <div>Unable to join the call.</div>;
  }
  console.log(data)
  return (
    <div style={{ position: "fixed", inset: 0, background: "#000" }}>


      <JaaSMeeting
        appId={data?.appId as string}
        roomName={data?.room as string}
        jwt={data?.jwt}
        configOverwrite={{ disableLocalVideoFlip: true, prejoinPageEnabled: false }}
        onApiReady={(externalApi) => {
          // fires as soon as the local user hangs up
          externalApi.addListener("videoConferenceLeft", () => {
            router.replace("/dashboard");
          });
        }}
        getIFrameRef={(node) => {
          node.style.height = "100%";
          node.style.width = "100%";
          node.style.border = "0";
        }}
        spinner={() => <div style={{ color: "#fff" }}>Loading call...</div>}
      />
    </div>
    // <iframe
    //         src={data.joinUrl}
    //         allow="camera; microphone; fullscreen; display-capture; autoplay"
    //         className="h-screen w-full border-0"
    //     />
  );
}