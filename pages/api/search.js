export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  console.log("Received body:", req.body);

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

  const results = {};

  try {
    // FLIGHTS (Travelpayouts)
    if (includeFlights) {
      const flightRes = await fetch(
        `https://api.travelpayouts.com/v1/prices/cheap?origin=${origin}&destination=KEF&depart_date=${departureDate}&return_date=${returnDate}&token=${process.env.TRAVELPAYOUTS_TOKEN}`
      );
      const flightData = await flightRes.json();
      console.log("Flight data:", flightData);
      results.flights = Object.values(flightData.data?.KEF || {});
    }

    // HOTELS (fake for now)
    if (includeHotels) {
      results.hotels = [
        { name: "Hotel Reykjavik", price: 150 },
        { name: "Budget Stay", price: 100 }
      ];
    }

    // RENTAL CARS (fake for now)
    if (includeCars) {
      results.cars = [
        { type: "Economy", price: 85 },
        { type: "SUV", price: 130 }
      ];
    }

    // TOURS (fake for now)
    if (includeTours) {
      results.tours = [
        { name: "Golden Circle Tour", price: 110 },
        { name: "Northern Lights Tour", price: 95 }
      ];
    }

    res.status(200).json(results);
  } catch (error) {
    console.error("API error:", error);
    res.status(500).json({ error: error.message || "Internal server error" });
  }
}

