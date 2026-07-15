import { NextResponse } from "next/server";
import { getState, saveState } from "@/lib/store";
import { isValidTaskState } from "@/lib/validate";

export async function GET() {
  const state = await getState();
  return NextResponse.json(state);
}

export async function PUT(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (!isValidTaskState(body)) {
    return NextResponse.json({ error: "Invalid task state" }, { status: 400 });
  }

  await saveState(body);
  return NextResponse.json(body);
}
