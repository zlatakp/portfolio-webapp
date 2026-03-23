import { Section, Text } from "@react-email/components";
import * as React from "react";
import { EmailLayout } from "./EmailLayout";

interface BookingReminderProps {
  clientName: string;
  serviceName: string;
  bookingDate: string;
  timeRange: string;
}

export function BookingReminder({
  clientName,
  serviceName,
  bookingDate,
  timeRange,
}: BookingReminderProps) {
  return (
    <EmailLayout
      preview={`Reminder: your ${serviceName} session is tomorrow.`}
      title="Your session is tomorrow"
    >
      <Text style={paragraph}>Hi {clientName},</Text>
      <Text style={paragraph}>
        This is a friendly reminder that your photography session is coming up in the
        next 24 hours.
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
        If you need to reschedule, please reply as soon as possible so we can help.
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
  backgroundColor: "#f3f0fb",
  borderRadius: "18px",
  margin: "24px 0",
  padding: "20px 22px",
};

const label = {
  color: "#5a4a8a",
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
