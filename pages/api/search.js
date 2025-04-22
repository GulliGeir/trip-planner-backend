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
    // ✅ Flights - real API
    if (includeFlights) {
      const flightRes = await fetch(
        `https://api.travelpayouts.com/v1/prices/cheap?origin=${origin}&destination=KEF&depart_date=${departureDate}&return_date=${returnDate}&token=${process.env.TRAVELPAYOUTS_TOKEN}`
      );
      const flightData = await flightRes.json();
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

    // TOURS for Bokun Reseller
if (includeTours) {
  try {
    const startDate = departureDate || new Date().toISOString().split('T')[0];
    const endDate = returnDate || startDate;

    const response = await fetch(`https://api.bokun.io/product-search.json?startDate=${startDate}&endDate=${endDate}`, {
      headers: {
        "X-Bokun-AccessKey": process.env.BOKUN_API_KEY,
        "Content-Type": "application/json"
      }
    });

    const bokunData = await response.json();

    results.tours = (bokunData.products || []).map((tour) => ({
      id: tour.id,
      name: tour.title,
      description: tour.shortDescription || '',
      price: tour.defaultPrice?.amount || 0,
      currency: tour.defaultPrice?.currency || 'USD',
      thumbnail: tour.photos?.[0]?.url || null
    }));
  } catch (err) {
    console.error("Bokun reseller tour fetch error:", err);
    results.tours = [];
  }
}


    return res.status(200).json(results);

  } catch (error) {
    console.error("Main Error:", error);
    return res.status(500).json({ error: error.message || "Internal Server Error" });
  }
}


