export interface Message {
  id:number | null,
  messageContent: string;
  timeStamp: Date;
  isRead: boolean;
  senderId: string | null;
  recieverId: string | null;
  groupId: string | null;
  type:string;
  
}