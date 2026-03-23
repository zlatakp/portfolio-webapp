import { BookingStatus, type Booking, type Service } from "@prisma/client";
import { format } from "date-fns";
import { Resend } from "resend";
import { BookingCancellation } from "@/emails/BookingCancellation";
import { BookingConfirmation } from "@/emails/BookingConfirmation";
import { BookingConfirmed } from "@/emails/BookingConfirmed";
import { BookingReminder } from "@/emails/BookingReminder";

export type BookingWithService = Booking & { service: Service };

function getResendClient() {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    throw new Error("RESEND_API_KEY is not configured.");
  }

  return new Resend(apiKey);
}

function getFromEmail() {
  const from = process.env.RESEND_FROM_EMAIL;

  if (!from) {
    throw new Error("RESEND_FROM_EMAIL is not configured.");
  }

  return from;
}

function getPhotographerEmail() {
  const email = process.env.PHOTOGRAPHER_EMAIL;

  if (!email) {
    throw new Error("PHOTOGRAPHER_EMAIL is not configured.");
  }

  return email;
}

function formatBookingDate(date: Date) {
  return format(date, "EEEE, d MMMM yyyy");
}

function formatBookingTimeRange(booking: BookingWithService) {
  return `${booking.startTime} - ${booking.endTime}`;
}

async function sendClientEmail(input: {
  to: string;
  subject: string;
  react: React.ReactNode;
}) {
  const resend = getResendClient();

  return resend.emails.send({
    from: getFromEmail(),
    to: input.to,
    subject: input.subject,
    react: input.react,
  });
}

/**
 * Sends the client-facing pending confirmation email.
 */
export async function sendBookingConfirmationEmail(booking: BookingWithService) {
  return sendClientEmail({
    to: booking.clientEmail,
    subject: `Booking received: ${booking.service.name}`,
    react: BookingConfirmation({
      clientName: booking.clientName,
      serviceName: booking.service.name,
      bookingDate: formatBookingDate(booking.date),
      timeRange: formatBookingTimeRange(booking),
    }),
  });
}

/**
 * Sends the plain-text photographer notification for a new booking.
 */
export async function sendPhotographerBookingNotification(booking: BookingWithService) {
  const resend = getResendClient();

  return resend.emails.send({
    from: getFromEmail(),
    to: getPhotographerEmail(),
    subject: `New booking request: ${booking.service.name}`,
    text: [
      `New booking request received.`,
      `Client: ${booking.clientName}`,
      `Email: ${booking.clientEmail}`,
      `Service: ${booking.service.name}`,
      `Date: ${formatBookingDate(booking.date)}`,
      `Time: ${formatBookingTimeRange(booking)}`,
      booking.clientPhone ? `Phone: ${booking.clientPhone}` : null,
      booking.notes ? `Notes: ${booking.notes}` : null,
    ]
      .filter(Boolean)
      .join("\n"),
  });
}

/**
 * Sends the confirmation email when an admin confirms a booking.
 */
export async function sendBookingConfirmedEmail(booking: BookingWithService) {
  return sendClientEmail({
    to: booking.clientEmail,
    subject: `Booking confirmed: ${booking.service.name}`,
    react: BookingConfirmed({
      clientName: booking.clientName,
      serviceName: booking.service.name,
      bookingDate: formatBookingDate(booking.date),
      timeRange: formatBookingTimeRange(booking),
    }),
  });
}

/**
 * Sends the cancellation email when an admin cancels a booking.
 */
export async function sendBookingCancellationEmail(booking: BookingWithService) {
  return sendClientEmail({
    to: booking.clientEmail,
    subject: `Booking cancelled: ${booking.service.name}`,
    react: BookingCancellation({
      clientName: booking.clientName,
      serviceName: booking.service.name,
      bookingDate: formatBookingDate(booking.date),
      timeRange: formatBookingTimeRange(booking),
    }),
  });
}

/**
 * Sends the 24-hour reminder email for a confirmed booking.
 */
export async function sendBookingReminderEmail(booking: BookingWithService) {
  return sendClientEmail({
    to: booking.clientEmail,
    subject: `Reminder: ${booking.service.name} tomorrow`,
    react: BookingReminder({
      clientName: booking.clientName,
      serviceName: booking.service.name,
      bookingDate: formatBookingDate(booking.date),
      timeRange: formatBookingTimeRange(booking),
    }),
  });
}

/**
 * Sends the lifecycle email that matches a booking status change.
 */
export async function sendStatusEmail(booking: BookingWithService) {
  if (booking.status === BookingStatus.CONFIRMED) {
    await sendBookingConfirmedEmail(booking);
  }

  if (booking.status === BookingStatus.CANCELLED) {
    await sendBookingCancellationEmail(booking);
  }
}
