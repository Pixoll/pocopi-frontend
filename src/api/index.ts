import { client } from "./client.gen";
import * as sdk from "./sdk.gen";
import type { UpdateActiveConfigData } from "./types.gen.ts";

export default sdk;
export type * from "./types.gen";
export type ConfigUpdateWithFiles = NonNullable<UpdateActiveConfigData["body"]>;

client.setConfig({
  baseUrl: import.meta.env.VITE_API_URL,
  auth: () => localStorage.getItem("token") ?? "",
});
