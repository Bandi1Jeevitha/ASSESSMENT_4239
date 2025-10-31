import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Layout from "../components/Layout";
import { Experience } from "@shared/api";

export default function Home() {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchExperiences();
  }, []);

  const fetchExperiences = async () => {
    try {
      const response = await fetch("/api/experiences");
      if (!response.ok) throw new Error("Failed to fetch experiences");
      const data = await response.json();
      setExperiences(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row gap-4">
          <input
            type="text"
            placeholder="Search experiences"
            className="flex-1 px-4 py-3 border-2 border-accent rounded placeholder-muted-foreground"
          />
          <button className="btn-primary">Search</button>
        </div>
      </div>

      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            <p className="mt-4 text-muted-foreground">Loading experiences...</p>
          </div>
        </div>
      )}

      {error && (
        <div className="bg-destructive/10 border border-destructive text-destructive px-4 py-3 rounded">
          {error}
        </div>
      )}

      {!loading && !error && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {experiences.map((experience) => (
            <div
              key={experience.id}
              className="bg-card rounded overflow-hidden border border-border hover:shadow-lg transition-shadow"
            >
              <div className="aspect-video overflow-hidden bg-muted">
                <img
                  src={experience.image}
                  alt={experience.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="p-4">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="font-semibold text-sm text-foreground">
                    {experience.title}
                  </h3>
                </div>

                <p className="text-xs text-muted-foreground mb-2">
                  {experience.location}
                </p>

                <p className="text-xs text-muted-foreground mb-4 line-clamp-2">
                  {experience.description}
                </p>

                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-foreground">
                    From ₹{experience.price}
                  </span>
                </div>

                <Link
                  to={`/details/${experience.id}`}
                  className="btn-primary w-full text-center block mt-3"
                >
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && !error && experiences.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No experiences found</p>
        </div>
      )}
    </Layout>
  );
}
