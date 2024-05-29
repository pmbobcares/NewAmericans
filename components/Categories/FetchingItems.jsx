
const fetchItems = async () => {
    try {
      const response = await fetch('http://34.16.206.128:3000/ItemData');
      if (response.ok) {
        const data = await response.json();
        return data || []; // Return an empty array if items data is undefined
      } else {
        console.error('Failed to fetch item data');
        return [];
      }
    } catch (error) {
      console.error('Error fetching item data:', error);
      return [];
    }
  };
  
  export { fetchItems };
  