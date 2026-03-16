import "stream-chat";

/**
 * Augment the Stream Chat SDK's CustomChannelData interface
 * so that `name` (and any other custom fields we pass when
 * creating / updating channels) are recognised by TypeScript.
 *
 * @see https://getstream.io/chat/docs/sdk/react/guides/customization/typescript/
 */
declare module "stream-chat" {
  interface CustomChannelData {
    name?: string;
    image?: string;
  }
}
