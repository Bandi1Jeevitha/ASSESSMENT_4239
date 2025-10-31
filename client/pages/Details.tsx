import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import Layout from "../components/Layout";
import { Experience } from "@shared/api";

interface BookingState {
  selectedDate: string;
  selectedTime: string;
  quantity: number;
}

export default function Details() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [experience, setExperience] = useState<Experience | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [booking, setBooking] = useState<BookingState>({
    selectedDate: "",
    selectedTime: "",
    quantity: 1,
  });

  useEffect(() => {
    if (id) {
      fetchExperience();
    }
  }, [id]);

  const fetchExperience = async () => {
    try {
      const response = await fetch(`/api/experiences/${id}`);
      if (!response.ok) throw new Error("Experience not found");
      const data = await response.json();
      setExperience(data);
      if (data.availability && data.availability.length > 0) {
        setBooking((prev) => ({
          ...prev,
          selectedDate: data.availability[0].date,
        }));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = () => {
    if (!booking.selectedDate || !booking.selectedTime) {
      alert("Please select a date and time");
      return;
    }

    const bookingData = {
      experienceId: id,
      date: booking.selectedDate,
      time: booking.selectedTime,
      quantity: booking.quantity,
      totalPrice: experience!.price * booking.quantity,
    };

    sessionStorage.setItem("bookingData", JSON.stringify(bookingData));
    navigate("/checkout");
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            <p className="mt-4 text-muted-foreground">Loading experience...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (error || !experience) {
    return (
      <Layout>
        <div className="bg-destructive/10 border border-destructive text-destructive px-4 py-3 rounded">
          {error || "Experience not found"}
        </div>
      </Layout>
    );
  }

  const currentSlot = experience.availability.find(
    (slot) => slot.date === booking.selectedDate
  );
  const availableTimes = currentSlot?.times || [];

  return (
    <Layout>
      <div className="mb-6">
        <button
          onClick={() => navigate("/")}
          className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-2"
        >
          ← Details
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="aspect-video overflow-hidden bg-muted rounded-lg mb-6">
            <img
              src={experience.image}
              alt={experience.title}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="border-2 border-accent p-6 rounded-lg mb-6">
            <h1 className="text-2xl font-bold text-foreground mb-4">
              {experience.title}
            </h1>
            <p className="text-sm text-muted-foreground mb-4">
              {experience.longDescription}
            </p>

            <div className="mb-6">
              <h3 className="font-semibold text-foreground mb-4">Choose date</h3>
              <div className="flex gap-3 flex-wrap">
                {experience.availability.map((slot) => {
                  const date = new Date(slot.date);
                  const dateStr = date.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  });
                  return (
                    <button
                      key={slot.date}
                      onClick={() =>
                        setBooking((prev) => ({
                          ...prev,
                          selectedDate: slot.date,
                          selectedTime: "",
                        }))
                      }
                      className={`px-4 py-2 rounded font-semibold text-sm transition-colors ${
                        booking.selectedDate === slot.date
                          ? "btn-primary"
                          : "bg-secondary text-foreground hover:bg-muted"
                      }`}
                    >
                      {dateStr}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="mb-6">
              <h3 className="font-semibold text-foreground mb-4">Choose time</h3>
              <div className="flex gap-3 flex-wrap">
                {availableTimes.map((time) => (
                  <button
                    key={time}
                    onClick={() =>
                      setBooking((prev) => ({
                        ...prev,
                        selectedTime: time,
                      }))
                    }
                    className={`px-4 py-2 rounded font-semibold text-sm transition-colors ${
                      booking.selectedTime === time
                        ? "btn-primary"
                        : "bg-secondary text-foreground hover:bg-muted"
                    }`}
                  >
                    {time}
                  </button>
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-3">
                All times are in IST (GMT +5:30)
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-foreground mb-4">About</h3>
              <p className="text-sm text-muted-foreground">
                {experience.description}
              </p>
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-card border border-border rounded-lg p-6 sticky top-24">
            <p className="text-sm text-muted-foreground mb-2">Starts at</p>
            <p className="text-2xl font-bold text-foreground mb-6">
              ₹{experience.price}
            </p>

            <div className="space-y-4 mb-6">
              <div>
                <p className="text-sm text-muted-foreground">Quantity</p>
                <div className="flex items-center gap-4 mt-2">
                  <button
                    onClick={() =>
                      setBooking((prev) => ({
                        ...prev,
                        quantity: Math.max(1, prev.quantity - 1),
                      }))
                    }
                    className="font-bold text-lg text-muted-foreground"
                  >
                    −
                  </button>
                  <span className="font-bold text-lg">{booking.quantity}</span>
                  <button
                    onClick={() =>
                      setBooking((prev) => ({
                        ...prev,
                        quantity: prev.quantity + 1,
                      }))
                    }
                    className="font-bold text-lg text-muted-foreground"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="pt-4 border-t border-border">
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Subtotal</span>
                  <span className="font-semibold text-foreground">
                    ₹{experience.price * booking.quantity}
                  </span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Taxes</span>
                  <span className="font-semibold text-foreground">
                    ₹{Math.floor(experience.price * booking.quantity * 0.05)}
                  </span>
                </div>
              </div>

              <div className="pt-4 border-t border-border">
                <div className="flex justify-between">
                  <span className="font-semibold text-foreground">Total</span>
                  <span className="text-lg font-bold text-foreground">
                    ₹
                    {Math.floor(
                      experience.price * booking.quantity * 1.05
                    )}
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={handleConfirm}
              disabled={!booking.selectedDate || !booking.selectedTime}
              className="btn-primary w-full text-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
