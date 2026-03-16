import "server-only";
import { StreamChat } from "stream-chat";

const apiKey = process.env.STREAM_API_KEY;
const apiSecret = process.env.STREAM_API_SECRET;

if (!apiKey || !apiSecret) {
  throw new Error(
    "Missing Stream credentials. Add STREAM_API_KEY and STREAM_API_SECRET to your .env file.",
  );
}

export const serverClient = StreamChat.getInstance(apiKey, apiSecret);
