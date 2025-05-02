require('dotenv').config({ path: __dirname + '/../.env' });
const axios = require('axios');
const querystring = require('querystring');

const restaurantAddress = "SY23 3FL";
const prepTimeMinutes = 20; // Constant preparation time


exports.checkDelivery = async (req, res) => {
  const { userAddress } = req.body; // Expect the customer's address (or postcode) in the request body
  if (!userAddress) {
    return res.status(400).json({ error: "User address is required" });
  }

  try {
    //query parameters for the Distance Matrix API request
    const params = querystring.stringify({
      origins: userAddress,
      destinations: restaurantAddress,
      key: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    });
    const url = `https://maps.googleapis.com/maps/api/distancematrix/json?${params}`;


    // Make the API call to Google Distance Matrix API
    const response = await axios.get(url);
    
    // Check for valid status in the response
    const element = response.data.rows[0].elements[0];
    if (element.status !== "OK") {
      return res.status(400).json({ error: "Invalid address or no route found" });
    }

    const distanceInMeters = element.distance.value;
    const travelDurationText = element.duration.text; // e.g., "35 mins"
    const travelMinutes = parseInt(travelDurationText.split(' ')[0], 10);
    const totalMinutes = travelMinutes + prepTimeMinutes;

    res.status(200).json({
        distance: distanceInMeters,
        travelDuration: travelDurationText,
        prepTime: `${prepTimeMinutes} mins`,
        totalETA: `${totalMinutes} mins`,
      });
    } catch (err) {
      console.error("Error in checkDelivery:", err);
      res.status(500).json({ error: err.message });
    }
  };
