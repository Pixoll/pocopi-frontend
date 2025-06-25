import { client } from "./client.gen";
import * as sdk from "./sdk.gen";

export default sdk;
export type * from "./types.gen";

client.setConfig({
  baseUrl: import.meta.env.VITE_API_URL,
});
