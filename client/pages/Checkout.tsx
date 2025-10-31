import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";

interface CheckoutFormData {
  fullName: string;
  email: string;
  promoCode: string;
  agreeToTerms: boolean;
}

interface BookingDetails {
  experienceId: string;
  date: string;
  time: string;
  quantity: number;
  totalPrice: number;
}

interface PromoResponse {
  valid: boolean;
  discount: number;
}

export default function Checkout() {
  const navigate = useNavigate();
  const [booking, setBooking] = useState<BookingDetails | null>(null);
  const [formData, setFormData] = useState<CheckoutFormData>({
    fullName: "",
    email: "",
    promoCode: "",
    agreeToTerms: false,
  });
  const [discount, setDiscount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const savedBooking = sessionStorage.getItem("bookingData");
    if (!savedBooking) {
      navigate("/");
      return;
    }
    setBooking(JSON.parse(savedBooking));
  }, [navigate]);

  const handleApplyPromo = async () => {
    if (!formData.promoCode.trim()) {
      setError("Please enter a promo code");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/promo/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: formData.promoCode }),
      });

      const data: PromoResponse = await response.json();
      if (data.valid) {
        setDiscount(data.discount);
      } else {
        setError("Invalid promo code");
        setDiscount(0);
      }
    } catch (err) {
      setError("Failed to validate promo code");
      setDiscount(0);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.fullName || !formData.email) {
      setError("Please fill in all required fields");
      return;
    }

    if (!formData.agreeToTerms) {
      setError("Please agree to the terms and safety policy");
      return;
    }

    if (!booking) return;

    setSubmitting(true);
    setError("");

    try {
      const finalPrice = Math.max(0, booking.totalPrice - discount);
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          experienceId: booking.experienceId,
          date: booking.date,
          time: booking.time,
          fullName: formData.fullName,
          email: formData.email,
          quantity: booking.quantity,
          promoCode: formData.promoCode || undefined,
          totalPrice: finalPrice,
        }),
      });

      if (!response.ok) throw new Error("Booking failed");

      const result = await response.json();
      sessionStorage.removeItem("bookingData");
      sessionStorage.setItem("bookingResult", JSON.stringify(result));
      navigate("/result");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Booking failed");
    } finally {
      setSubmitting(false);
    }
  };

  if (!booking) {
    return (
      <Layout>
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        </div>
      </Layout>
    );
  }

  const finalPrice = Math.max(0, booking.totalPrice - discount);
  const taxAmount = Math.floor(booking.totalPrice * 0.05);

  return (
    <Layout>
      <div className="mb-6">
        <button
          onClick={() => navigate(-1)}
          className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-2"
        >
          ← Checkout
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-card border border-border rounded-lg p-6">
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">
                    Full name
                  </label>
                  <input
                    type="text"
                    placeholder="Your name"
                    value={formData.fullName}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        fullName: e.target.value,
                      }))
                    }
                    className="w-full px-4 py-3 bg-secondary border border-border rounded placeholder-muted-foreground text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    placeholder="Your name"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        email: e.target.value,
                      }))
                    }
                    className="w-full px-4 py-3 bg-secondary border border-border rounded placeholder-muted-foreground text-sm"
                  />
                </div>
              </div>

              <div className="mb-4">
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Promo code"
                    value={formData.promoCode}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        promoCode: e.target.value,
                      }))
                    }
                    className="flex-1 px-4 py-3 bg-secondary border border-border rounded placeholder-muted-foreground text-sm"
                  />
                  <button
                    type="button"
                    onClick={handleApplyPromo}
                    disabled={loading}
                    className="btn-dark disabled:opacity-50"
                  >
                    {loading ? "Applying..." : "Apply"}
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="terms"
                  checked={formData.agreeToTerms}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      agreeToTerms: e.target.checked,
                    }))
                  }
                  className="w-4 h-4"
                />
                <label
                  htmlFor="terms"
                  className="text-sm text-muted-foreground"
                >
                  I agree to the terms and safety policy
                </label>
              </div>
            </div>

            {error && (
              <div className="bg-destructive/10 border border-destructive text-destructive px-4 py-3 rounded text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="btn-primary w-full text-center disabled:opacity-50"
            >
              {submitting ? "Processing..." : "Pay and Confirm"}
            </button>
          </form>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-card border border-border rounded-lg p-6 sticky top-24">
            <h3 className="font-semibold text-foreground mb-4">Experience</h3>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">
                  Experience
                </span>
                <span className="text-sm font-semibold text-foreground">
                  Kayaking
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Date</span>
                <span className="text-sm font-semibold text-foreground">
                  {booking.date}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Time</span>
                <span className="text-sm font-semibold text-foreground">
                  {booking.time}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Qty</span>
                <span className="text-sm font-semibold text-foreground">
                  {booking.quantity}
                </span>
              </div>
            </div>

            <div className="border-t border-border pt-4 mb-4">
              <div className="flex justify-between mb-3">
                <span className="text-sm text-muted-foreground">Subtotal</span>
                <span className="text-sm font-semibold text-foreground">
                  ₹{booking.totalPrice}
                </span>
              </div>
              <div className="flex justify-between mb-3">
                <span className="text-sm text-muted-foreground">Taxes</span>
                <span className="text-sm font-semibold text-foreground">
                  ₹{taxAmount}
                </span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between mb-3 text-green-600">
                  <span className="text-sm font-semibold">Discount</span>
                  <span className="text-sm font-semibold">-₹{discount}</span>
                </div>
              )}
            </div>

            <div className="border-t border-border pt-4">
              <div className="flex justify-between">
                <span className="font-semibold text-foreground">Total</span>
                <span className="text-lg font-bold text-foreground">
                  ₹{finalPrice}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
