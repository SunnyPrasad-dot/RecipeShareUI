import { createApp } from "../server/index.js";

let appPromise;

export default async function handler(req, res) {
  appPromise ??= createApp({ isProduction: true, includeStatic: false });
  const app = await appPromise;
  return app(req, res);
}