import api, { ApiResponse } from "@/lib/axios";

interface VideoCall {
    roomId: string
    joinUrl: string
}

export async function createVideoCall() {
    const response = await api.post<ApiResponse<VideoCall>>("video-call-test");
    return response.data.data;
}

export async function getVideoCallJoinUrl(roomId: string) {
    const response = await api.get<ApiResponse<VideoCall>>(`video-call-test/join/${roomId}`);
    return response.data.data;
}



