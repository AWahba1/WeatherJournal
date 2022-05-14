const base = 'http://api.openweathermap.org/geo/1.0/zip?';
const base2 = 'https://api.openweathermap.org/data/2.5/weather?';
// Personal API Key for OpenWeatherMap API
const myAPIKey = '&appid=8b6bcc9cd9a183026333e9fdded284ad&units=imperial';

const generateButton = document.getElementById('generate');
generateButton.addEventListener('click', (e) => {

    const zipcode = document.getElementById('zip');
    const feelings = document.getElementById('feelings');


    let date = new Date();

    getGeoCoordinates(zipcode)
        .then((data) => {
            console.log(data);
            return getTemperatureAndCity({
                lat: data.lat,
                lon: data.lon
            });
        })
        .then(info => {
            console.log("info", info);
            return postAllData('/addData', {
                temp: info.temp,
                city: info.city,
                date: date.toDateString(),
                content: feelings.value
            });
        })
        .then((newData) => {

            modifyUI('/getAll');
        })
        .catch((err) => {
            console.log(err);
            alert("Invalid postal code. \nPlease enter other one.");
        });
})

//gets Geographical Coordinates (longitude & latitude) based on given zipcode
async function getGeoCoordinates(zipcode) {

    //fetches zip codes inside USA only uncless other country code is specified
    const response = await fetch(base + "zip=" + zipcode.value + myAPIKey);
    if (!response.ok) {
        throw new Error("Cannot get coordinates. Invalid URL");
    }
    const data = await response.json();
    return data;


}

//get Temperature & City Name based on longitude & latitude given
async function getTemperatureAndCity(data) {
    const newURL = base2 + "lat=" + data.lat + "&lon=" + data.lon + myAPIKey;
    const response = await fetch(newURL);
    if (!response.ok)
        throw new Error("Cannot get temperature. Invalid URL");
    data = await response.json();
    return {
        temp: data.main.temp,
        city: data.name
    };
}

// change projectData object in server.js
async function postAllData(URL, infoObj) {
    response = await fetch(URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(infoObj)
    });

    if (!response.ok)
        throw new Error("Couldn't post data");


    return await response.json();;



}

async function modifyUI(URL) {
    response = await fetch(URL);
    data = await response.json();
    if (!response.ok)
        throw new Error("Couldn't fetch all data");

    console.log("modifying UI");

    // Updating UI Elements based on data fetched from server
    document.getElementById('temp').innerHTML = "Weather in " + data.city + " is " + data.temp + " °F";
    document.getElementById('date').innerHTML = data.date;
    document.getElementById('content').innerHTML = data.content;





}