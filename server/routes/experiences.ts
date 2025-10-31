import { RequestHandler } from "express";
import { Experience } from "@shared/api";

const experiences: Experience[] = [
  {
    id: "1",
    title: "Kayaking",
    location: "Udupi",
    description:
      "Curated small-group experience. Certified guide. Safety first with gear included.",
    longDescription:
      "Curated small-group experience. Certified guide. Safety first with gear included. Helmet and Life jackets along with an expert will accompany in kayaking.",
    image:
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop",
    price: 999,
    duration: "2 hours",
    minAge: 10,
    availability: [
      { date: "2025-10-22", times: ["07:00 am", "09:00 am", "11:00 am"] },
      { date: "2025-10-23", times: ["07:00 am", "09:00 am", "11:00 am"] },
      { date: "2025-10-24", times: ["07:00 am", "09:00 am", "11:00 am"] },
      { date: "2025-10-25", times: ["07:00 am", "09:00 am", "11:00 am"] },
      { date: "2025-10-26", times: ["07:00 am", "09:00 am", "11:00 am"] },
    ],
  },
  {
    id: "2",
    title: "Nandi Hills Sunrise",
    location: "Bangalore",
    description:
      "Curated small-group experience. Certified guide. Safety first with gear included.",
    longDescription:
      "Experience the breathtaking sunrise at Nandi Hills with a certified guide. Perfect for photography and nature lovers.",
    image:
      "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&h=600&fit=crop",
    price: 899,
    duration: "3 hours",
    minAge: 8,
    availability: [
      { date: "2025-10-22", times: ["05:00 am", "06:00 am"] },
      { date: "2025-10-23", times: ["05:00 am", "06:00 am"] },
      { date: "2025-10-24", times: ["05:00 am", "06:00 am"] },
      { date: "2025-10-25", times: ["05:00 am", "06:00 am"] },
    ],
  },
  {
    id: "3",
    title: "Coffee Trail",
    location: "Coorg",
    description:
      "Curated small-group experience. Certified guide. Safety first with gear included.",
    longDescription:
      "Explore the lush coffee plantations of Coorg with an expert guide. Learn about coffee cultivation and enjoy fresh brew.",
    image:
      "https://images.unsplash.com/photo-1516426122078-8023e06b2a91?w=800&h=600&fit=crop",
    price: 1299,
    duration: "4 hours",
    minAge: 12,
    availability: [
      { date: "2025-10-22", times: ["09:00 am", "01:00 pm", "03:00 pm"] },
      { date: "2025-10-23", times: ["09:00 am", "01:00 pm", "03:00 pm"] },
      { date: "2025-10-24", times: ["09:00 am", "01:00 pm", "03:00 pm"] },
    ],
  },
  {
    id: "4",
    title: "Boat Cruise",
    location: "Sundarbans",
    description:
      "Curated small-group experience. Certified guide. Safety first with gear included.",
    longDescription:
      "Explore the mangrove forests and spot wildlife on a thrilling boat cruise through the Sundarbans.",
    image:
      "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&h=600&fit=crop",
    price: 999,
    duration: "2.5 hours",
    minAge: 5,
    availability: [
      { date: "2025-10-22", times: ["08:00 am", "02:00 pm", "04:00 pm"] },
      { date: "2025-10-23", times: ["08:00 am", "02:00 pm", "04:00 pm"] },
      { date: "2025-10-24", times: ["08:00 am", "02:00 pm", "04:00 pm"] },
    ],
  },
  {
    id: "5",
    title: "Bungee Jumping",
    location: "Manali",
    description:
      "Curated small-group experience. Certified guide. Safety first with gear included.",
    longDescription:
      "Get your adrenaline rush with a thrilling bungee jump from a 120m high platform. All safety equipment provided.",
    image:
      "https://images.unsplash.com/photo-1529407828158-c3211de63dd8?w=800&h=600&fit=crop",
    price: 1999,
    duration: "1 hour",
    minAge: 18,
    availability: [
      { date: "2025-10-22", times: ["09:00 am", "11:00 am", "02:00 pm"] },
      { date: "2025-10-23", times: ["09:00 am", "11:00 am", "02:00 pm"] },
      { date: "2025-10-24", times: ["09:00 am", "11:00 am", "02:00 pm"] },
    ],
  },
  {
    id: "6",
    title: "Kayaking",
    location: "Udupi, Karnataka",
    description:
      "Curated small-group experience. Certified guide. Safety first with gear included.",
    longDescription:
      "Curated small-group experience. Certified guide. Safety first with gear included.",
    image:
      "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&h=600&fit=crop",
    price: 999,
    duration: "2 hours",
    minAge: 10,
    availability: [
      { date: "2025-10-22", times: ["07:00 am", "09:00 am"] },
      { date: "2025-10-23", times: ["07:00 am", "09:00 am"] },
    ],
  },
  {
    id: "7",
    title: "Volcano Trekking",
    location: "Hawaii",
    description:
      "Curated small-group experience. Certified guide. Safety first with gear included.",
    longDescription:
      "Trek to the top of an active volcano and witness the power of nature up close.",
    image:
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop",
    price: 2499,
    duration: "5 hours",
    minAge: 16,
    availability: [
      { date: "2025-10-22", times: ["06:00 am", "08:00 am"] },
      { date: "2025-10-23", times: ["06:00 am", "08:00 am"] },
    ],
  },
  {
    id: "8",
    title: "Forest Hiking",
    location: "Coorg",
    description:
      "Curated small-group experience. Certified guide. Safety first with gear included.",
    longDescription:
      "Explore the pristine forests of Coorg with an experienced guide. Spot rare wildlife and enjoy nature at its best.",
    image:
      "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&h=600&fit=crop",
    price: 799,
    duration: "3 hours",
    minAge: 10,
    availability: [
      { date: "2025-10-22", times: ["07:00 am", "09:00 am"] },
      { date: "2025-10-23", times: ["07:00 am", "09:00 am"] },
      { date: "2025-10-24", times: ["07:00 am", "09:00 am"] },
    ],
  },
];

export const handleGetExperiences: RequestHandler = (_req, res) => {
  res.json(experiences);
};

export const handleGetExperience: RequestHandler = (req, res) => {
  const { id } = req.params;
  const experience = experiences.find((exp) => exp.id === id);

  if (!experience) {
    return res.status(404).json({ error: "Experience not found" });
  }

  res.json(experience);
};
