import { Section, Text } from "@react-email/components";
import * as React from "react";
import { EmailLayout } from "./EmailLayout";

interface BookingConfirmationProps {
  clientName: string;
  serviceName: string;
  bookingDate: string;
  timeRange: string;
}

export function BookingConfirmation({
  clientName,
  serviceName,
  bookingDate,
  timeRange,
}: BookingConfirmationProps) {
  return (
    <EmailLayout
      preview={`We received your ${serviceName} booking request for ${bookingDate}.`}
      title="Your booking request is in"
    >
      <Text style={paragraph}>Hi {clientName},</Text>
      <Text style={paragraph}>
        Thanks for booking with us. Your request has been received and is currently
        pending confirmation.
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
        We will follow up shortly with a confirmation email once the booking is
        approved.
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
  backgroundColor: "#f9f3ed",
  borderRadius: "18px",
  margin: "24px 0",
  padding: "20px 22px",
};

const label = {
  color: "#8a5a31",
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
