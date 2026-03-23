import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";

interface EmailLayoutProps {
  preview: string;
  title: string;
  children: React.ReactNode;
}

export function EmailLayout({ preview, title, children }: EmailLayoutProps) {
  return (
    <Html>
      <Head />
      <Preview>{preview}</Preview>
      <Body style={body}>
        <Container style={container}>
          <Section style={eyebrowSection}>
            <Text style={eyebrow}>Photographer Portfolio</Text>
          </Section>
          <Heading style={heading}>{title}</Heading>
          <Section>{children}</Section>
          <Hr style={divider} />
          <Text style={footer}>
            This email was sent from your photography booking system. Please reply
            directly if you need to reschedule or ask a question.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

const body = {
  backgroundColor: "#f6efe7",
  color: "#241b14",
  fontFamily: "Helvetica, Arial, sans-serif",
  margin: 0,
  padding: "32px 0",
};

const container = {
  backgroundColor: "#ffffff",
  borderRadius: "24px",
  margin: "0 auto",
  maxWidth: "640px",
  padding: "40px 32px",
};

const eyebrowSection = {
  marginBottom: "16px",
};

const eyebrow = {
  color: "#8a5a31",
  fontSize: "12px",
  fontWeight: 700,
  letterSpacing: "0.24em",
  margin: 0,
  textTransform: "uppercase" as const,
};

const heading = {
  color: "#241b14",
  fontSize: "28px",
  fontWeight: 700,
  lineHeight: "36px",
  margin: "0 0 24px",
};

const divider = {
  borderColor: "#eadccc",
  margin: "32px 0 24px",
};

const footer = {
  color: "#6b5848",
  fontSize: "13px",
  lineHeight: "20px",
  margin: 0,
};
