import { VideoCall } from "@/features/video-call/video-call";

export default async function VideoPage({
  params,
}: {
  params: Promise<{ roomId: string }>;
}) {
  const { roomId } = await params;

  return <VideoCall roomId={roomId} />;
}