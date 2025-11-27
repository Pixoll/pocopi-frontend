import { client } from "./client.gen";
import * as sdk from "./sdk.gen";
import type { UpdateActiveConfigData } from "./types.gen.ts";

const sdkOverride = Object.fromEntries(Object.entries(sdk).map(([name, fn]) =>
  [name, (...args: unknown[]) => {
    if (import.meta.env.DEBUG) {
      const location = new Error().stack?.split("\n")[1];
      if (location) {
        const [fnCall, filePath] = location.split("@");
        const fileParts = filePath.split("/");
        const fileName = fileParts[fileParts.length - 1].replace(/\?t=\d+/, "");
        console.log(`called api.${name} from ${fnCall} in ${fileName}`)
      }
    }

    // @ts-expect-error args are type independent
    return fn(...args);
  }]
)) as typeof sdk;

export default sdkOverride;
export type * from "./types.gen";
export type ConfigUpdateWithFiles = NonNullable<UpdateActiveConfigData["body"]>;

client.setConfig({
  baseUrl: import.meta.env.VITE_API_URL,
  auth: () => localStorage.getItem("token") ?? "",
});
