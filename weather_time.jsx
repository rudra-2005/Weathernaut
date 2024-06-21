import React, { useState } from "react";
import axios from "axios";

const TimeandWeatherByLocation = () => {
    const [location, setLocation] = useState("");
    const [weather, setWeather] = useState(null);
    const [date, setDate] = useState("");
    const [time, setTime] = useState("");
    const [error, setError] = useState("");

    const handleLocationChange = (event) => {
        setLocation(event.target.value);
    };

    const fetchWeather = async (location) => {
        try {
            const apiKey = "YOUR_API_KEY"; 
            const url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}&units=metric`;
            const response = await axios.get(url);

            if (response.status === 200) {
                const data = response.data;
                setWeather({
                    description: data.weather[0].description,
                    temperature: data.main.temp,
                    feels_like: data.main.feels_like,
                    humidity: data.main.humidity,
                    wind_speed: data.wind.speed,
                    city: data.name,
                    country: data.sys.country,
                });
                setError("");
            } else {
                setError("Invalid location for weather data. Please try again.");
                setWeather(null);
            }
        } catch (error) {
            setError("Failed to fetch weather. Please try again.");
            setWeather(null);
        }
    };

    const fetchTime = async (location) => {
        try {
            const opencageApiKey = "YOUR_API_KEY";
            const opencageUrl = `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(location)}&key=${opencageApiKey}&language=en&pretty=1`;

            const opencageResponse = await axios.get(opencageUrl);

            if (opencageResponse.data.results.length > 0) {
                const { lat, lng } = opencageResponse.data.results[0].geometry;

                const timeZoneApiKey = "YOUR_API_KEY";
                const timeZoneUrl = `http://api.timezonedb.com/v2.1/get-time-zone?key=${timeZoneApiKey}&format=json&by=position&lat=${lat}&lng=${lng}`;

                const timeZoneResponse = await axios.get(timeZoneUrl);

                if (timeZoneResponse.data.status === "OK") {
                
                    const localTime = new Date(timeZoneResponse.data.formatted);
                    
                    setTime(localTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit'}));
                   
                    setDate(localTime.toLocaleDateString());
                    setError("");
                } else {
                    setError("Invalid location for time zone data. Please try again.");
                    setTime("");
                    setDate("");
                }
            } else {
                setError("Invalid location. Please enter a valid location.");
                setTime("");
                setDate("");
            }
        } catch (error) {
            setError("Failed to fetch time. Please try again.");
            setTime("");
            setDate("");
        }
    };


    const handleSubmit = (event) => {
        event.preventDefault();
        if (location) {
            fetchTime(location);
            fetchWeather(location);
        } else {
            setError("Please enter a location.");
        }
    };

    return (
        <div className="d1">
            <h1 className="h1">WEATHERNAUT</h1>
            <form className="f1" onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={location}
                    onChange={handleLocationChange}
                    placeholder="Enter Location"
                    className="i1"
                />
                <button type="submit" className="b1">Get Info</button>
            </form>
            {error && <p className="p1" style={{ color: 'red' }}>{error}</p>}
            {time && <p className="p2">{time}</p>}
            {date && <p className="p9"> {date}</p>}
            {weather && (
                <div className="d4">
                    <div className="d2"><p className="p3">{weather.city}, {weather.country}</p>
                        
                        <p className="p4">{weather.description}</p>
                        <p className="p5">Temperature: {weather.temperature} °C</p>
                    </div>
                    <div className="d3">
                        <p className="p6">Feels Like: {weather.feels_like} °C</p>
                        <p className="p7">Humidity: {weather.humidity}%</p>
                        <p className="p8">Wind Speed: {weather.wind_speed} m/s</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TimeandWeatherByLocation;
