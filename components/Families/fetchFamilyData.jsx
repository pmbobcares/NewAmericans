const fetchFamilyData = async () => {
    try {
      const response = await fetch('http://34.16.206.128:3000/FamilyData');
      if (response.ok) {
        const data = await response.json();
        return data || [];
      } else {
        console.error('Failed to fetch Family data');
        return [];
      }
    } catch (error) {
      console.error('Error fetching admin data:', error);
      return [];
    }
  };
  
  export { fetchFamilyData };