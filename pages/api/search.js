// pages/api/search.js

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { origin, departureDate, returnDate, adults, budget, includeFlights, includeHotels, includeCars, includeTours } = req.body;
  const results = {};

  try {
    // Flights (example using Travelpayouts API)
    if (includeFlights) {
      const flightUrl = `https://api.travelpayouts.com/v1/prices/cheap?origin=${origin}&destination=KEF&depart_date=${departureDate}&return_date=${returnDate}&token=2352229ce17e3f55dda5315050907762`;
      const flightRes = await fetch(flightUrl);
      const flightData = await flightRes.json();
      results.flights = flightData.data.KEF || [];
    }

    // Hotels (mock example; replace with your real API logic)
    if (includeHotels) {
      results.hotels = [
        { name: "Hotel Reykjavik", price: 150 },
        { name: "Icelandic Comfort", price: 120 }
      ];
    }

    // Rental Cars (mock example)
    if (includeCars) {
      results.cars = [
        { type: "Economy", price: 100 },
        { type: "SUV", price: 150 }
      ];
    }

    // Tours (example using Bokun API)
    if (includeTours) {
      const bokunUrl = 'https://api.bokun.io/activity.json'; // check actual endpoint and params in Bokun docs
      const tourRes = await fetch(bokunUrl, {
        headers: {
          "X-Bokun-AccessKey": "YOUR_BOKUN_API_KEY"
        }
      });
      const tourData = await tourRes.json();
      results.tours = tourData.activities || [];
    }

    res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

