import { createClient } from "next-sanity";

export const client = createClient({
  projectId: "f4ktdtvf",
  dataset: "production",
  apiVersion: "2025-11-13",
  useCdn: true,
});
