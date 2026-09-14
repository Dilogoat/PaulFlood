import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const runtime = "nodejs";
export const alt = "Paul Flood Heritage — 1955–2008";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage() {
  let portraitSrc: string | null = null;
  try {
    const portrait = await readFile(
      join(process.cwd(), "public/uploads/2008/paul-flood-1955-2008.jpg")
    );
    portraitSrc = `data:image/jpeg;base64,${portrait.toString("base64")}`;
  } catch {
    portraitSrc = null;
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-start",
          padding: "72px",
          backgroundImage: "linear-gradient(135deg, #faf8f5 0%, #f5f0e8 100%)",
          backgroundColor: "#faf8f5",
          fontFamily: "Georgia, 'Times New Roman', serif"
        }}
      >
        {portraitSrc ? (
          <img
            src={portraitSrc}
            alt=""
            width={340}
            height={340}
            style={{
              width: "340px",
              height: "340px",
              borderRadius: "24px",
              objectFit: "cover",
              border: "6px solid #ffffff",
              boxShadow: "0 10px 30px rgba(28,25,23,0.18)"
            }}
          />
        ) : null}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            marginLeft: portraitSrc ? "56px" : "0px",
            maxWidth: portraitSrc ? "660px" : "1000px"
          }}
        >
          <div
            style={{
              display: "flex",
              width: "72px",
              height: "6px",
              backgroundColor: "#b45309",
              borderRadius: "3px",
              marginBottom: "28px"
            }}
          />
          <div
            style={{
              fontSize: "84px",
              fontWeight: 700,
              color: "#1c1917",
              lineHeight: 1.05
            }}
          >
            Paul Flood
          </div>
          <div
            style={{
              fontSize: "40px",
              color: "#b45309",
              marginTop: "12px",
              letterSpacing: "2px"
            }}
          >
            1955 – 2008
          </div>
          <div
            style={{
              fontSize: "28px",
              color: "#44403c",
              marginTop: "28px",
              lineHeight: 1.35
            }}
          >
            {"Player, coach, mentor & pioneer of women's and tag rugby at St Mary's College RFC"}
          </div>
          <div
            style={{
              fontSize: "22px",
              color: "#78716c",
              marginTop: "36px",
              letterSpacing: "1px"
            }}
          >
            paulflood.sytes.net
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
