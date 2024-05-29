const putAdmin = async (updatedAdmin) => {
    try {
        const response = await fetch(`http://34.16.206.128:3000/PutAdminData/${updatedAdmin.AdminID}`, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedAdmin),
        });
        const data = await response.json();
        console.log('Admin updated:', data);
    } catch (error) {
        console.error('Error updating admin:', error);
    }
};
export { putAdmin };