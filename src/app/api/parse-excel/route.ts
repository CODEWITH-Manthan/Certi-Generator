import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";

const FASTAPI_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";
const BACKEND_API_KEY = process.env.BACKEND_API_KEY || "dev_secret_key";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ detail: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const excelFile = formData.get("excel") as File;
    if (!excelFile) {
      return NextResponse.json({ detail: "Missing excel file" }, { status: 400 });
    }

    const response = await fetch(`${FASTAPI_URL}/parse-excel`, {
      method: "POST",
      headers: {
        "x-api-key": BACKEND_API_KEY,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      return new NextResponse(errorText, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (err: any) {
    console.error("API Proxy Error:", err);
    return NextResponse.json({ detail: err.message || "Proxy error" }, { status: 500 });
  }
}
