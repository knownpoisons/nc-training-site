import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "NotContent Training — AI Creative Training for Enterprise Teams";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#ffffff",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          padding: "80px",
          fontFamily: "monospace",
        }}
      >
        {/* Brand mark */}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span
            style={{
              fontSize: 18,
              fontWeight: 700,
              letterSpacing: "0.08em",
              color: "#000",
            }}
          >
            NOTCONTENT
          </span>
          <span style={{ fontSize: 18, color: "#999", fontWeight: 300 }}>
            / training
          </span>
        </div>

        {/* Headline */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            marginTop: 60,
            flex: 1,
          }}
        >
          <h1
            style={{
              fontSize: 68,
              fontWeight: 300,
              lineHeight: 1.1,
              color: "#000",
              margin: 0,
              maxWidth: 900,
            }}
          >
            AI Creative Training for Enterprise Teams.
          </h1>

          {/* Stats row */}
          <div
            style={{
              display: "flex",
              gap: 60,
              marginTop: 60,
            }}
          >
            {[
              { n: "96%", label: "Avg. time savings" },
              { n: "400%", label: "Output increase" },
              { n: "$280K", label: "Saved on a single launch" },
            ].map((stat) => (
              <div
                key={stat.n}
                style={{ display: "flex", flexDirection: "column", gap: 6 }}
              >
                <span
                  style={{ fontSize: 40, fontWeight: 300, color: "#1549CD" }}
                >
                  {stat.n}
                </span>
                <span style={{ fontSize: 16, color: "#888" }}>{stat.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            borderTop: "1px solid #e5e5e5",
            paddingTop: 32,
            marginTop: 40,
          }}
        >
          <span style={{ fontSize: 16, color: "#999" }}>
            Nike · Apple · Cash App · Maesa · Adidas · Google
          </span>
          <span
            style={{
              fontSize: 16,
              color: "#fff",
              background: "#1549CD",
              padding: "10px 24px",
              letterSpacing: "0.08em",
            }}
          >
            training.notcontent.ai
          </span>
        </div>
      </div>
    ),
    { ...size }
  );
}
