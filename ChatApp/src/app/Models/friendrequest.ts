import { RequestStatus } from "../Enums/RequestStatus";

export interface FriendRequest{
  id: number | null,
  senderId: string | null,
  receiverId: string | null,
  requestStatus: RequestStatus
}