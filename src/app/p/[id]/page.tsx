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
  // ✅ VERY IMPORTANT: await params
  const { id } = await params;

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

  if (!baseUrl) {
    throw new Error("NEXT_PUBLIC_BASE_URL is not defined");
  }

  const res = await fetch(`${baseUrl}/api/pastes/${id}`, {
    cache: "no-store",
  });

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
          padding: "1rem",
          whiteSpace: "pre-wrap",
          wordBreak: "break-word",
        }}
      >
        {data.content}
      </pre>
    </main>
  );
}
