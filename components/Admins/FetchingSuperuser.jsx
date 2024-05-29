// Function to fetch superuser passcode
const fetchSuperuser = async () => {
    try {
      const response = await fetch('http://34.16.206.128:3000/SuperuserData');
      if (response.ok) {
        const data = await response.json();
        return data;
    } else {
        console.error('Failed to fetch superuser');
        return [];
      }
    } catch (error) {
      console.error('Error fetching superuser:', error);
      return [];
    }
  };
  
  export { fetchSuperuser };
  