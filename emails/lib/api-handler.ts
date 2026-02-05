import { NextRequest, NextResponse } from "next/server";
import { sendEmail } from "@/emails/lib/email-service";
import WelcomeEmail, { buildJsonFileName } from "@/emails/welcome-email";

export async function handleSendEmail(request: NextRequest) {
  try {
    const body = await request.json();
    const { to, userName, userEmail, jsonData } = body;

    if (!to) {
      return NextResponse.json(
        { error: "Recipient email required" },
        { status: 400 },
      );
    }

    if (!jsonData) {
      return NextResponse.json(
        { error: "JSON required" },
        { status: 400 },
      );
    }

    const fileName = buildJsonFileName(userName || "user");
    const jsonString =
      typeof jsonData === "string"
        ? jsonData
        : JSON.stringify(jsonData ?? {}, null, 2);

    await sendEmail(
      to,
      //SUBJECT
      "CARRA - TEST FROM WEB",
      WelcomeEmail({ userName, userEmail: userEmail || to, fileName }),
      {
        fileName,
        content: jsonString,
      },
    );

    return NextResponse.json(
      { message: "Success" },
      { status: 200 },
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Error sending email" },
      { status: 500 },
    );
  }
}

export async function handleDownloadJson() {
  return NextResponse.json(
    { error: "Download not available. The JSON is attached to the email." },
    { status: 410 },
  );
}
