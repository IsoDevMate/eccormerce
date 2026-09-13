import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          background: "#141414",
          color: "#f4f1eb",
          padding: 64,
          fontFamily: "Georgia, serif",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 28,
            letterSpacing: 12,
            textTransform: "uppercase",
          }}
        >
          SABLE
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            fontSize: 72,
            marginTop: 24,
            lineHeight: 1.05,
          }}
        >
          <div style={{ display: "flex" }}>Cut, color, fit —</div>
          <div style={{ display: "flex" }}>without the noise.</div>
        </div>
      </div>
    ),
    { ...size },
  );
}
