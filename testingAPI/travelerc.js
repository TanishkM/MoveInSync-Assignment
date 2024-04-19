const axios = require('axios'); 
const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRhbmlzaHFtb2hhbkBpaXRiaGlsYWkuYWMuaW4iLCJ1c2VybmFtZSI6InRoZV9kZXRlY3RpdmVBIiwiaWF0IjoxNzEzNTM0MjI2LCJleHAiOjE3MTM2MjA2MjZ9.8wfv4EYrupGmC33BhK32cgD6YkTfGO7DfqjPVpro1fo';

async function fetchTripData() {
    const link='http://localhost:5000/api/trips/viewTrip/66227577cba2ca54cfbf8268';
    
    try {
        const response = await axios.get(link, {
            headers: {
                authorization: token
            }
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching data:", error);
        return null;
    }
}

async function fetchNotifications() {
    const link='http://localhost:5000/api/trips/getNotification';
    

    try {
        const response = await axios.get(link, {
            headers: {
                authorization: token
            }
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching data:", error);
        return null;
    }
}


function displayNotifications() {
    console.log("Notifications:", notifications);
  }
  
  
  async function updateNotifications(link) {
    const newData = await fetchNotifications(link);
    const anotherData = await fetchTripData();
    if (newData) {
      
      notifications = newData.notifications;
      console.log(anotherData.data.curLat,anotherData.data.curLong);
      displayNotifications();
    }
  }
  
  
  
  const interval = setInterval(() => {
    updateNotifications();
  }, 5000);
