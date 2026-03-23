import { Section, Text } from "@react-email/components";
import * as React from "react";
import { EmailLayout } from "./EmailLayout";

interface BookingConfirmedProps {
  clientName: string;
  serviceName: string;
  bookingDate: string;
  timeRange: string;
}

export function BookingConfirmed({
  clientName,
  serviceName,
  bookingDate,
  timeRange,
}: BookingConfirmedProps) {
  return (
    <EmailLayout
      preview={`Your ${serviceName} booking has been confirmed for ${bookingDate}.`}
      title="Your booking is confirmed"
    >
      <Text style={paragraph}>Hi {clientName},</Text>
      <Text style={paragraph}>
        Great news. Your booking has been confirmed and your session is officially on
        the calendar.
      </Text>
      <Section style={card}>
        <Text style={label}>Service</Text>
        <Text style={value}>{serviceName}</Text>
        <Text style={label}>Date</Text>
        <Text style={value}>{bookingDate}</Text>
        <Text style={label}>Time</Text>
        <Text style={value}>{timeRange}</Text>
      </Section>
      <Text style={paragraph}>
        If anything changes before the session, reply to this email and we can help
        you reschedule.
      </Text>
    </EmailLayout>
  );
}

const paragraph = {
  color: "#3d3127",
  fontSize: "15px",
  lineHeight: "24px",
  margin: "0 0 16px",
};

const card = {
  backgroundColor: "#eef6ee",
  borderRadius: "18px",
  margin: "24px 0",
  padding: "20px 22px",
};

const label = {
  color: "#4c6d4c",
  fontSize: "12px",
  fontWeight: 700,
  letterSpacing: "0.16em",
  margin: "0 0 4px",
  textTransform: "uppercase" as const,
};

const value = {
  color: "#241b14",
  fontSize: "16px",
  lineHeight: "24px",
  margin: "0 0 12px",
};
