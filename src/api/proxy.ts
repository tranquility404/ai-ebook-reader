
import type { VercelRequest, VercelResponse } from "@vercel/node";
import { Readable } from "node:stream";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  try {
    const backendUrl = process.env.BACKEND_URL;

    if (!backendUrl) {
      return res.status(500).json({
        error: "BACKEND_URL is not configured",
      });
    }

    const path = Array.isArray(req.query.path)
      ? req.query.path.join("/")
      : req.query.path ?? "";

    const queryIndex = req.url?.indexOf("?") ?? -1;
    const queryString =
      queryIndex !== -1 ? req.url!.substring(queryIndex) : "";

    const targetUrl = `${backendUrl.replace(
      /\/$/,
      ""
    )}/${path}${queryString}`;

    const headers = new Headers();

    for (const [key, value] of Object.entries(req.headers)) {
      if (key.toLowerCase() === "host") continue;

      if (Array.isArray(value)) {
        headers.set(key, value.join(","));
      } else if (value !== undefined) {
        headers.set(key, value);
      }
    }

    const hasBody = !["GET", "HEAD"].includes(req.method ?? "");

    const response = await fetch(targetUrl, {
      method: req.method,
      headers,
      body: hasBody
        ? (Readable.toWeb(req) as unknown as BodyInit)
        : undefined,
      // Required when streaming the incoming request body.
      duplex: "half",
    } as RequestInit);

    res.status(response.status);

    response.headers.forEach((value, key) => {
      // Avoid forwarding hop-by-hop headers.
      if (
        !["connection", "transfer-encoding"].includes(key.toLowerCase())
      ) {
        res.setHeader(key, value);
      }
    });

    const responseBuffer = Buffer.from(
      await response.arrayBuffer()
    );

    return res.send(responseBuffer);
  } catch (error) {
    console.error("Proxy error:", error);

    return res.status(502).json({
      error: "Failed to connect to backend",
    });
  }
}