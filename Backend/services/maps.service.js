const axios = require('axios');
const captainModel = require('../models/captain.model');

module.exports.getAddressCoordinate = async (address) => {
    const apiKey = process.env.GOOGLE_MAPS_API;
    const baseUrl = "https://maps.gomaps.pro/maps/api/geocode/json";
    const url = `${baseUrl}?address=${encodeURIComponent(address)}&key=${apiKey}`;

    try {
        const response = await axios.get(url);
        if (response.data.status === 'OK') {
            const location = response.data.results[0].geometry.location;
            return {
                lat: location.lat,
                lng: location.lng
            };
        } else {
            throw new Error('Unable to fetch coordinates');
        }
    } catch (error) {
        console.error(error);
        throw error;
    }
};

module.exports.getDistanceTime = async (origins, destinations) => {
    if (!origins || !destinations) {
        throw new Error('Origin and destination are required');
    }

    const apiKey = process.env.GOOGLE_MAPS_API;
    const baseUrl = "https://maps.gomaps.pro/maps/api/distancematrix/json"; 
    const url = `${baseUrl}?origins=${encodeURIComponent(origins)}&destinations=${encodeURIComponent(destinations)}&key=${apiKey}`;

    try {


        const response = await axios.get(url);
        if (response.data.status === 'OK') {
            const element = response.data.rows[0].elements[0];
            if (response.data.rows[ 0 ].elements[ 0 ].status === 'ZERO_RESULTS') {
                throw new Error('No routes found');
            }

            return {
                distance: element.distance,
                duration: element.duration
            };
        } else {
            throw new Error('Unable to fetch distance and time');
        }

    } catch (err) {
        console.error(err);
        throw err;
    }
};

module.exports.getAutoCompleteSuggestions=async(input)=>{
    if(!input){
        throw new Error('query is required');
    }

    const apiKey=process.env.GOOGLE_MAPS_API;
    const baseUrl = "https://maps.gomaps.pro/maps/api/place/autocomplete/json";
    const url = `${baseUrl}?input=${encodeURIComponent(input)}&key=${apiKey}`;
    try {
        const response = await axios.get(url);

        if (response.data.status === 'OK') {
            return response.data.predictions.map(prediction => prediction.description).filter(value => value);
        } else {
            throw new Error("Failed to fetch autocomplete results");
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
};


module.exports.getCaptainsInTheRadius = async (ltd, lng, radius) => {
    const captains = await captainModel.find({
        location: {
            $geoWithin: {
                $centerSphere: [[ltd, lng], radius / 6371]
            }
        }
    });
    return captains;
}
