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
  const res = await fetch(
    `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}`,
  );
  if (!res.ok) throw Error("Failed getting address");

  const data = await res.json();
  return data;
}
