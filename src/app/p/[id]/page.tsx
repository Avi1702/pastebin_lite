import { notFound } from "next/navigation";

type PasteResponse = {
  content: string;
  remaining_views: number | null;
  expires_at: string | null;
};

export default async function PastePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const res = await fetch(
    `${process.env.VERCEL_URL ? "https://" + process.env.VERCEL_URL : "http://localhost:3000"}/api/pastes/${id}`,
    {
      cache: "no-store",
    }
  );

  if (!res.ok) {
    notFound();
  }

  const data = (await res.json()) as PasteResponse;

  return (
    <main style={{ padding: "2rem", fontFamily: "monospace" }}>
      <h1>Paste</h1>

      <pre
          style={{
            backgroundColor: "#ffffff",
            color: "#111111",
            opacity: 1,
            padding: "1rem",
            whiteSpace: "pre-wrap",
            wordBreak: "break-word",
          }}
      >
        {data.content}
      </pre>

      <div style={{ marginTop: "1rem", fontSize: "0.9rem", color: "#555" }}>
        {data.remaining_views !== null && (
          <p>Remaining views: {data.remaining_views}</p>
        )}
        {data.expires_at && (
          <p>Expires at: {new Date(data.expires_at).toLocaleString()}</p>
        )}
      </div>
    </main>
  );
} 
