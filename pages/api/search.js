export default async function handler(req, res) {
  // Make sure it's a POST request
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Log the incoming body
  console.log("Received body:", req.body);

  // Destructure the request data
  const {
    origin,
    departureDate,
    returnDate,
    adults,
    budget,
    includeFlights,
    includeHotels,
    includeCars,
    includeTours
  } = req.body;

  // Start building results
  const results = {};

  try {
    // ✅ Flights - real API
    if (includeFlights) {
      const travelpayoutsUrl = `https://api.travelpayouts.com/v1/prices/cheap?origin=${origin}&destination=KEF&depart_date=${departureDate}&return_date=${returnDate}&token=${process.env.TRAVELPAYOUTS_TOKEN}`;
      const flightRes = await fetch(travelpayoutsUrl);
      const flightData = await flightRes.json();

      // Parse data safely
      results.flights = Object.values(flightData.data?.KEF || {});
    }

    // ✅ Hotels - fake data
    if (includeHotels) {
      results.hotels = [
        { name: "Reykjavik Grand Hotel", price: 160 },
        { name: "Iceland Budget Inn", price: 95 }
      ];
    }

    // ✅ Cars - fake data
    if (includeCars) {
      results.cars = [
        { type: "Compact", price: 85 },
        { type: "SUV", price: 120 }
      ];
    }

    // ✅ Tours - fake data
    if (includeTours) {
      results.tours = [
        { name: "Golden Circle Tour", price: 115 },
        { name: "Northern Lights Adventure", price: 95 }
      ];
    }

    // Return everything as JSON
    return res.status(200).json(results);

  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ error: error.message || "Internal Server Error" });
  }
}

