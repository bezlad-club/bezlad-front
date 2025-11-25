import { client } from "@/lib/sanityClient";

export const fetchSanityData = async (
  query: string,
  params: Record<string, unknown> = {}
) => {
  try {
    const response = await client.fetch(query, params);

    return response;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    throw new Error("Failed to fetch Sanity data");
  }
};
