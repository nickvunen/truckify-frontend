import {
  Camper,
  Attribute,
  Booking,
  Settings,
  AvailabilityResult,
  CalendarData,
} from "./types";

const API_BASE_URL = "http://localhost:8000/api";

// Camper API calls
export const getCampers = async (includeInactive = false): Promise<Camper[]> => {
  const response = await fetch(
    `${API_BASE_URL}/campers?include_inactive=${includeInactive}`
  );
  return response.json();
};

export const getCamper = async (id: number): Promise<Camper> => {
  const response = await fetch(`${API_BASE_URL}/campers/${id}`);
  return response.json();
};

export const createCamper = async (camper: Partial<Camper>): Promise<Camper> => {
  const response = await fetch(`${API_BASE_URL}/campers`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(camper),
  });
  return response.json();
};

export const updateCamper = async (
  id: number,
  camper: Partial<Camper>
): Promise<Camper> => {
  const response = await fetch(`${API_BASE_URL}/campers/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(camper),
  });
  return response.json();
};

export const deleteCamper = async (id: number): Promise<void> => {
  await fetch(`${API_BASE_URL}/campers/${id}`, { method: "DELETE" });
};

// Attribute API calls
export const getAttributes = async (
  includeInactive = false
): Promise<Attribute[]> => {
  const response = await fetch(
    `${API_BASE_URL}/attributes?include_inactive=${includeInactive}`
  );
  return response.json();
};

export const createAttribute = async (
  attribute: Partial<Attribute>
): Promise<Attribute> => {
  const response = await fetch(`${API_BASE_URL}/attributes`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(attribute),
  });
  return response.json();
};

export const updateAttribute = async (
  id: number,
  attribute: Partial<Attribute>
): Promise<Attribute> => {
  const response = await fetch(`${API_BASE_URL}/attributes/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(attribute),
  });
  return response.json();
};

export const deleteAttribute = async (id: number): Promise<void> => {
  await fetch(`${API_BASE_URL}/attributes/${id}`, { method: "DELETE" });
};

// Booking API calls
export const getBookings = async (): Promise<Booking[]> => {
  const response = await fetch(`${API_BASE_URL}/bookings`);
  const data = await response.json();
  return data;
};

export const getBooking = async (id: number): Promise<Booking> => {
  const response = await fetch(`${API_BASE_URL}/bookings/${id}`);
  return response.json();
};

export const createBooking = async (
  booking: Partial<Booking>
): Promise<Booking> => {
  const response = await fetch(`${API_BASE_URL}/bookings`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(booking),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || "Failed to create booking");
  }
  return response.json();
};

export const updateBooking = async (
  id: number,
  booking: Partial<Booking>
): Promise<Booking> => {
  const response = await fetch(`${API_BASE_URL}/bookings/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(booking),
  });
  return response.json();
};

export const cancelBooking = async (id: number): Promise<void> => {
  await fetch(`${API_BASE_URL}/bookings/${id}`, { method: "DELETE" });
};

// Availability API call
export const checkAvailability = async (
  startDate: string,
  endDate: string
): Promise<{ availability: AvailabilityResult[] }> => {
  const response = await fetch(
    `${API_BASE_URL}/availability?start_date=${startDate}&end_date=${endDate}`
  );
  return response.json();
};

// Settings API calls
export const getSettings = async (): Promise<Settings> => {
  const response = await fetch(`${API_BASE_URL}/settings`);
  return response.json();
};

export const updateSettings = async (
  settings: Partial<Settings>
): Promise<Settings> => {
  const response = await fetch(`${API_BASE_URL}/settings`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(settings),
  });
  return response.json();
};

// Calendar API call
export const getCalendarData = async (
  year: number,
  month: number
): Promise<CalendarData> => {
  const response = await fetch(
    `${API_BASE_URL}/calendar?year=${year}&month=${month}`
  );
  return response.json();
};

// File upload
export const uploadFile = async (file: File): Promise<{ url: string }> => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${API_BASE_URL}/upload`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error("File upload failed");
  }

  return response.json();
};

