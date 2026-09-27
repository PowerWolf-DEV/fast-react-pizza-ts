export type Position = {
  latitude: number;
  longitude: number;
};

export type Address = {
  locality?: string;
  city?: string;
  postcode?: string;
  countryName?: string;
};

export async function getAddress({
  latitude,
  longitude,
}: Position): Promise<Address> {
  try {
    const res = await fetch(
      `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}`,
    );
    if (!res.ok) {
      throw new Error(
        `Failed getting address: ${res.status} ${res.statusText}`,
        {
          cause: new Error(`HTTP ${res.status}: ${res.statusText}`),
        },
      );
    }
    const data = await res.json();
    return data;
  } catch (err) {
    if (err instanceof Error) {
      throw new Error(`Geocoding failed: ${err.message}`, { cause: err });
    }
    const unknownError = new Error("Geocoding failed: Unknown error");
    throw unknownError;
  }
}
