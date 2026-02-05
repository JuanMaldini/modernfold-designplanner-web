import { Html, Head, Body, Container, Text } from "@react-email/components";
import * as React from "react";

interface WelcomeEmailProps {
  userName?: string;
  userEmail?: string;
  fileName?: string;
}

export const JSON_FILE_NAME_PREFIX = "quota-request";

export function buildJsonFileName(userName: string = "user") {
  const safeName = userName.replace(/\s+/g, "-").toLowerCase();
  return `${JSON_FILE_NAME_PREFIX}-${safeName}.json`;
}

export default function WelcomeEmail({
  userName = "User",
  userEmail = "email@example.com",
  fileName,
}: WelcomeEmailProps) {
  const resolvedFileName = fileName || buildJsonFileName(userName);

  return (
    <Html>
      <Head />
      <Body style={main}>
        <Container style={container}>
          <Text style={text}>
            {userName} has requested quota and need to get contacted at{" "}
            {userEmail}
          </Text>
          <Text style={text}>JSON adjunto: {resolvedFileName}</Text>
        </Container>
      </Body>
    </Html>
  );
}

const main = {
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};
const container = {
  display: "flex",
  justifyContent: "center",
  margin: "0 auto",
  padding: "20px 0 48px",
  marginBottom: "64px",
};
const text = { color: "#333", fontSize: "16px", margin: "24px 0" };
