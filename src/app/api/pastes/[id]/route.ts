import { NextResponse } from "next/server";
import { kv } from "@vercel/kv";

type Paste = {
  id: string;
  content: string;
  created_at: number;
  expires_at: number | null;
  max_views: number | null;
  views_used: number;
};

function getNow(req: Request) {
  if (process.env.TEST_MODE === "1") {
    const h = req.headers.get("x-test-now-ms");
    if (h) {
      const n = Number(h);
      if (!Number.isNaN(n)) return n;
    }
  }
  return Date.now();
}

export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const key = `paste:${id}`;

  const paste = (await kv.get(key)) as Paste | null;

  if (!paste) {
    return NextResponse.json(
      { error: "Paste not found" },
      { status: 404 }
    );
  }

  const now = getNow(req);

  //  TTL check
  if (paste.expires_at !== null && now > paste.expires_at) {
    return NextResponse.json(
      { error: "Paste expired" },
      { status: 404 }
    );
  }

  //  View limit check
  if (
    paste.max_views !== null &&
    paste.views_used >= paste.max_views
  ) {
    return NextResponse.json(
      { error: "View limit exceeded" },
      { status: 404 }
    );
  }

  //  Count this view
  paste.views_used += 1;
  await kv.set(key, paste);

  const remaining_views =
    paste.max_views === null
      ? null
      : Math.max(0, paste.max_views - paste.views_used);

  return NextResponse.json(
    {
      content: paste.content,
      remaining_views,
      expires_at: paste.expires_at
        ? new Date(paste.expires_at).toISOString()
        : null,
    },
    { status: 200 }
  );
}
