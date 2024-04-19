const express = require("express");
const app = express();
const axios = require('axios').default; 
let latitude = 48.8972;
let longitude = 2.3522;

app.get('/', (req, res) => {
    
    return res.status(201).json({ latitude: latitude.toString(), longitude: longitude.toString(), success: true, data: null });
});

app.listen(5001, () => {
    console.log("The client is up and running");

    
    setInterval(updateLocation, 6000);
});

async function updateLocation() {
    
    if (latitude === 48.8972 && longitude === 2.3522) {
        
        console.log('You are within 1 km of your destination');
        latitude = 48.8600;
        longitude = 2.2930;
    } else if (latitude === 48.8600 && longitude === 2.2930) {
        
        console.log('Trip completed successfully');
        latitude = 48.8584;
        longitude = 2.2945;
    } else {
        
        console.log('You are within 10 km of your destination');
        latitude = 48.8972;
        longitude = 2.3522;
    }
    
    try {
        
        const response = await axios.post('http://localhost:5000/api/trips/updateCurLocation', {curLat: latitude, curLong:longitude }, {
            headers: {
                'Content-Type': 'application/json',
                'authorization': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InN0YW5pc2hrbWVodGE1a0BnbWFpbC5jb20iLCJ1c2VybmFtZSI6InRoZV9kZXRlY3RpdmUiLCJpYXQiOjE3MTM0OTM0NjgsImV4cCI6MTcxMzU3OTg2OH0.FJMGb3YZKdWyuy0DN1_BbeC7I416gt9slBjKeTJk7ss',
            }
        });

        console.log(response.data);
    } catch (error) {
        console.error('Error:', error);
    }
}

// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InN0YW5pc2hrbWVodGE1a0BnbWFpbC5jb20iLCJ1c2VybmFtZSI6InRoZV9kZXRlY3RpdmUiLCJpYXQiOjE3MTM0OTM0NjgsImV4cCI6MTcxMzU3OTg2OH0.FJMGb3YZKdWyuy0DN1_BbeC7I416gt9slBjKeTJk7ss