const removeAdmin = async (admin) => {
    try {
        const response = await fetch(`http://34.16.206.128:3000/RemoveAdmin/${admin.AdminID}`, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
        });
        const data = await response.json();
        console.log('Admin removed:', data);
        // Optionally, you can update your local state or perform other actions after successful removal
    } catch (error) {
        console.error('Error removing admin:', error);
        // Handle error, show message to user, etc.
    }
};
export { removeAdmin };