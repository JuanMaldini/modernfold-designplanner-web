import { SESClient, SendRawEmailCommand } from '@aws-sdk/client-ses';
import { render } from '@react-email/render';

const sesClient = new SESClient({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export async function sendEmail(
  to: string,
  subject: string,
  emailComponent: React.ReactElement,
  attachment?: { fileName: string; content: string },
) {
  const emailHtml = await render(emailComponent);

  const rawMessage = buildRawEmail({
    to,
    subject,
    html: emailHtml,
    attachment,
  });

  try {
    const command = new SendRawEmailCommand({
      RawMessage: { Data: rawMessage },
    });
    const response = await sesClient.send(command);
    return { success: true, messageId: response.MessageId };
  } catch (error) {
    throw error;
  }
}

function buildRawEmail({
  to,
  subject,
  html,
  attachment,
}: {
  to: string;
  subject: string;
  html: string;
  attachment?: { fileName: string; content: string };
}) {
  const boundary = `NextBoundary_${Date.now()}_${Math.random().toString(16).slice(2)}`;
  const lines: string[] = [
    `From: ${process.env.SENDER_EMAIL}`,
    `To: ${to}`,
    `Subject: ${subject}`,
    'MIME-Version: 1.0',
    `Content-Type: multipart/mixed; boundary="${boundary}"`,
    '',
    `--${boundary}`,
    'Content-Type: text/html; charset="UTF-8"',
    'Content-Transfer-Encoding: 7bit',
    '',
    html,
    '',
  ];

  if (attachment) {
    const base64 = Buffer.from(attachment.content, 'utf-8').toString('base64');
    const chunked = chunkBase64(base64);
    lines.push(
      `--${boundary}`,
      `Content-Type: application/json; name="${attachment.fileName}"`,
      'Content-Transfer-Encoding: base64',
      `Content-Disposition: attachment; filename="${attachment.fileName}"`,
      '',
      chunked,
      '',
    );
  }

  lines.push(`--${boundary}--`, '');

  return Buffer.from(lines.join('\r\n'));
}

function chunkBase64(base64: string, size = 76) {
  const chunks: string[] = [];
  for (let i = 0; i < base64.length; i += size) {
    chunks.push(base64.slice(i, i + size));
  }
  return chunks.join('\r\n');
}
