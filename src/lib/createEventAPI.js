import { ENDPOINTS } from "./config";

export async function createEvent(data) {
  const response = await fetch(ENDPOINTS.CRUD_EVENTS, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("No se pudo crear el evento");
  }

  return await response.json();
}
