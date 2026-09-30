// components/video-call.tsx

"use client";

import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { getVideoCallJoinUrl } from "./api/video-call.api";

export function VideoCall({ roomId }: { roomId: string }) {

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

    if (isLoading) {
        return <div>Joining call...</div>;
    }


    if (isError) {
        return (
            <div>
                Unable to join the call.
                {error instanceof Error && (
                    <p>{error.message}</p>
                )}
            </div>
        );
    }

    if (!data?.joinUrl) {
        return <div>Unable to join the call.</div>;
    }

    return (
        <iframe
            src={data.joinUrl}
            allow="camera; microphone; fullscreen; display-capture; autoplay"
            className="h-screen w-full border-0"
        />
    );
}