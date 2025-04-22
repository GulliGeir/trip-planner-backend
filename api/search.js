export default async function handler(req, res) {
  const {
    origin,
    departureDate,
    returnDate,
    adults,
    includeFlights,
    includeHotels,
    includeCars,
    includeTours
  } = req.body;

  const token = "2352229ce17e3f55dda5315050907762"; // your Travelpayouts API token
  const marker = "623638";

  const results = {};

  if (includeFlights) {
    const flightUrl = `https://api.travelpayouts.com/v1/prices/cheap?origin=${origin}&destination=KEF&depart_date=${departureDate}&return_date=${returnDate}&token=${token}`;
    const resFlight = await fetch(flightUrl);
    const data = await resFlight.json();
    results.flights = data.data?.KEF || {};
  }

  if (includeHotels) {
    results.hotels = [
      { name: "Placeholder Hotel", price: 150, link: "https://www.travelpayouts.com/" }
    ];
  }

  if (includeCars) {
    results.cars = [
      { type: "Economy", price: 100, link: "https://www.travelpayouts.com/" }
    ];
  }

  if (includeTours) {
    results.tours = [
      { name: "Golden Circle Tour", price: 89, link: "https://www.bokun.io/" }
    ];
  }

  res.status(200).json(results);
}
