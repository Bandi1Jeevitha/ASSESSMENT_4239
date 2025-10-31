import { RequestHandler } from "express";
import { BookingRequest, BookingResponse } from "@shared/api";

const bookings: Map<string, BookingRequest> = new Map();

const generateBookingId = (): string => {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
};

export const handleCreateBooking: RequestHandler = (req, res) => {
  const booking: BookingRequest = req.body;

  if (!booking.experienceId || !booking.date || !booking.time) {
    return res.status(400).json({
      success: false,
      bookingId: "",
      message: "Missing required fields",
    });
  }

  if (!booking.fullName || !booking.email) {
    return res.status(400).json({
      success: false,
      bookingId: "",
      message: "Name and email are required",
    });
  }

  const email = booking.email.toLowerCase().trim();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({
      success: false,
      bookingId: "",
      message: "Invalid email address",
    });
  }

  const bookingId = generateBookingId();

  const bookingRecord = {
    ...booking,
    bookingId,
    createdAt: new Date().toISOString(),
  };

  bookings.set(bookingId, booking);

  const response: BookingResponse = {
    success: true,
    bookingId,
    message: "Booking confirmed successfully",
  };

  res.status(201).json(response);
};

export const handleGetBooking: RequestHandler = (req, res) => {
  const { id } = req.params;
  const booking = bookings.get(id);

  if (!booking) {
    return res.status(404).json({ error: "Booking not found" });
  }

  res.json(booking);
};
