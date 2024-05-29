const postNewCategory = async (category) => {
    try {
        const response = await fetch('http://34.16.206.128:3000/PostNewCategory', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(category)
        });
        const data = await response.json();
        console.log(data); // Log the response from the server
        // Handle success or display a message to the user
    } catch (error) {
        console.error('Error adding new category:', error);
        // Handle error or display an error message to the user
    }
};

export { postNewCategory };