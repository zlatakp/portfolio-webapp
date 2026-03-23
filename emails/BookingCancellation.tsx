import { Section, Text } from "@react-email/components";
import * as React from "react";
import { EmailLayout } from "./EmailLayout";

interface BookingCancellationProps {
  clientName: string;
  serviceName: string;
  bookingDate: string;
  timeRange: string;
}

export function BookingCancellation({
  clientName,
  serviceName,
  bookingDate,
  timeRange,
}: BookingCancellationProps) {
  return (
    <EmailLayout
      preview={`Your ${serviceName} booking for ${bookingDate} has been cancelled.`}
      title="Your booking has been cancelled"
    >
      <Text style={paragraph}>Hi {clientName},</Text>
      <Text style={paragraph}>
        Your booking has been cancelled. If this was unexpected, reply to this email
        and we can help you find a new time.
      </Text>
      <Section style={card}>
        <Text style={label}>Service</Text>
        <Text style={value}>{serviceName}</Text>
        <Text style={label}>Date</Text>
        <Text style={value}>{bookingDate}</Text>
        <Text style={label}>Time</Text>
        <Text style={value}>{timeRange}</Text>
      </Section>
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
  backgroundColor: "#fbefef",
  borderRadius: "18px",
  margin: "24px 0",
  padding: "20px 22px",
};

const label = {
  color: "#9b3c3c",
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
