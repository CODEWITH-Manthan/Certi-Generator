import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const FASTAPI_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session || !session.user || !session.user.email) {
      return NextResponse.json({ detail: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ detail: "User not found" }, { status: 401 });
    }

    // Get the FormData from the request
    const formData = await req.formData();
    const excelDataStr = formData.get("excel_data") as string;
    
    if (!excelDataStr) {
      return NextResponse.json({ detail: "Missing excel_data" }, { status: 400 });
    }

    const excelData = JSON.parse(excelDataStr);
    const requestedCerts = excelData.length;

    // Check Usage Limits
    let limit = 100;
    if (user.plan === "PRO") limit = 10000;
    if (user.plan === "EXPERT") limit = Infinity;

    if (user.certificatesGenerated + requestedCerts > limit) {
      return NextResponse.json(
        { detail: `Plan limit exceeded. You have ${limit - user.certificatesGenerated} certificates remaining.` },
        { status: 403 }
      );
    }

    const BACKEND_API_KEY = process.env.BACKEND_API_KEY || "dev_secret_key";
    
    // Proxy the request to FastAPI
    const response = await fetch(`${FASTAPI_URL}/generate`, {
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

    // Increment Usage
    await prisma.user.update({
      where: { id: user.id },
      data: {
        certificatesGenerated: {
          increment: requestedCerts,
        },
      },
    });

    // Return the ZIP file
    const zipBlob = await response.blob();
    return new NextResponse(zipBlob, {
      headers: {
        "Content-Type": "application/zip",
        "Content-Disposition": 'attachment; filename="certificates.zip"',
      },
    });
  } catch (err: any) {
    console.error("API Proxy Error:", err);
    return NextResponse.json({ detail: err.message || "Proxy error" }, { status: 500 });
  }
}
