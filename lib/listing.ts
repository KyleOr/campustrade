import {
  Timestamp,
} from "firebase/firestore";

export type listing = {
  id: string;
  title: string;
  price: number;
  category: string;
  description: string;
  username: string;
  createdAt?: Timestamp;
  location: string;
  condition: string;
  userId: string;
  userEmail: string;
};