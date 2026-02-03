import { Html, Head, Body, Container, Section, Text, Heading, Button } from '@react-email/components';
import * as React from 'react';

interface WelcomeEmailProps {
  userName?: string;
  userEmail?: string;
  jsonId?: string;
  baseUrl: string;
}

export default function WelcomeEmail({
  userName = 'User',
  userEmail = 'email@example.com',
  jsonId,
  baseUrl
}: WelcomeEmailProps) {
  const downloadUrl = jsonId
    ? `${baseUrl}/api/download-json?id=${jsonId}&name=quota-request-${userName.replace(/\s+/g, '-').toLowerCase()}.json`
    : undefined;

  return (
    <Html>
      <Head />
      <Body style={main}>
        <Container style={container}>
          <Text style={text}>{userName} has requested quota and need to get contacted at {userEmail}</Text>
          {downloadUrl && (
            <Section style={buttonContainer}>
              <Button style={downloadButtonStyle} href={downloadUrl}>
                Download JSON File
              </Button>
            </Section>
          )}
        </Container>
      </Body>
    </Html>
  );
}

const main = { fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif' };
const container = { display: 'flex', justifyContent: 'center', margin: '0 auto', padding: '20px 0 48px', marginBottom: '64px' };
const text = { color: '#333', fontSize: '16px', margin: '24px 0' };
const buttonContainer = { padding: '10px 0' };
const downloadButtonStyle = { backgroundColor: '#10b981', borderRadius: '4px', color: '#fff', fontSize: '16px', fontWeight: 'bold', textDecoration: 'none', textAlign: 'center' as const, display: 'block', width: '100%', padding: '12px' };
