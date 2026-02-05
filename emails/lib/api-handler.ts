import { NextRequest, NextResponse } from "next/server";
import { sendEmail } from "@/emails/lib/email-service";
import WelcomeEmail from "@/emails/welcome-email";
import { storeJson, getJson } from "@/emails/lib/json-storage";

export async function handleSendEmail(request: NextRequest) {
  try {
    const body = await request.json();
    const { to, userName, userEmail, jsonData } = body;

    if (!to) {
      return NextResponse.json(
        { error: "Email destinatario requerido" },
        { status: 400 },
      );
    }

    let jsonId: string | undefined = undefined;
    if (jsonData) {
      jsonId = await storeJson(jsonData);
    }

    const protocol = request.headers.get("x-forwarded-proto") || "http";
    const host = request.headers.get("host");
    const baseUrl = `${protocol}://${host}`;

    await sendEmail(
      to,
      //SUBJECT
      "CARRA - TEST FROM WEB",
      WelcomeEmail({ userName, userEmail: userEmail || to, jsonId, baseUrl }),
    );

    return NextResponse.json(
      { message: "Email enviado exitosamente" },
      { status: 200 },
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Error al enviar email" },
      { status: 500 },
    );
  }
}

export async function handleDownloadJson(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get("id");
    const fileName = searchParams.get("name") || "data.json";

    if (!id) {
      return NextResponse.json({ error: "ID requerido" }, { status: 400 });
    }

    const jsonData = await getJson(id);

    if (!jsonData) {
      return NextResponse.json(
        { error: "JSON no encontrado o expirado" },
        { status: 404 },
      );
    }

    // Si ya es un string (raw JSON), lo enviamos directo. Si es objeto, lo stringificamos.
    const jsonString =
      typeof jsonData === "string"
        ? jsonData
        : JSON.stringify(jsonData, null, 2);

    const safeFileName = sanitizeFileName(fileName);

    return new NextResponse(jsonString, {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Content-Disposition": `attachment; filename="${safeFileName}"`,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Error al descargar JSON" },
      { status: 500 },
    );
  }
}

function sanitizeFileName(name: string) {
  const normalized = name.trim() || "data.json";
  const safe = normalized.replace(/[^a-zA-Z0-9._-]+/g, "-");
  return safe.endsWith(".json") ? safe : `${safe}.json`;
}
