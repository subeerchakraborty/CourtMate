async function geocodeAddress({ courtName, address, city }) {
  const queries = [
    `${courtName}, ${address}, ${city}`,
    `${address}, ${city}`,
    city,
  ].filter(Boolean);

  for (const queryText of queries) {
    const query = encodeURIComponent(queryText);
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=jsonv2&limit=1&q=${query}`,
    );

    if (!response.ok) throw new Error("Location lookup failed");
    const results = await response.json();
    if (results.length) {
      return {
        type: "Point",
        coordinates: [Number(results[0].lon), Number(results[0].lat)],
      };
    }
  }

  return null;
}

export default geocodeAddress;
