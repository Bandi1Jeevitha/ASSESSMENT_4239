import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";

interface BookingResult {
  success: boolean;
  bookingId: string;
  message: string;
}

export default function Result() {
  const navigate = useNavigate();
  const [result, setResult] = useState<BookingResult | null>(null);

  useEffect(() => {
    const savedResult = sessionStorage.getItem("bookingResult");
    if (!savedResult) {
      navigate("/");
      return;
    }
    setResult(JSON.parse(savedResult));
    sessionStorage.removeItem("bookingResult");
  }, [navigate]);

  if (!result) {
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

  return (
    <Layout>
      <div className="min-h-96 flex flex-col items-center justify-center">
        {result.success ? (
          <div className="text-center">
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg
                className="w-12 h-12 text-green-600"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </div>

            <h1 className="text-3xl font-bold text-foreground mb-3">
              Booking Confirmed
            </h1>
            <p className="text-muted-foreground mb-8">
              Ref ID: {result.bookingId}
            </p>

            <button
              onClick={() => navigate("/")}
              className="btn-secondary"
            >
              Back to Home
            </button>
          </div>
        ) : (
          <div className="text-center">
            <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg
                className="w-12 h-12 text-red-600"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </div>

            <h1 className="text-3xl font-bold text-foreground mb-3">
              Booking Failed
            </h1>
            <p className="text-muted-foreground mb-8">{result.message}</p>

            <div className="flex gap-4 justify-center">
              <button
                onClick={() => navigate("/")}
                className="btn-secondary"
              >
                Back to Home
              </button>
              <button
                onClick={() => navigate(-1)}
                className="btn-primary"
              >
                Try Again
              </button>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
