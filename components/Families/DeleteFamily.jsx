const deleteFamily = async (family) => {
    try {
        const response = await fetch(`http://34.16.206.128:3000/DeleteFamily/${family.FamilyID}`, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
        });
        const data = await response.json();
        console.log('Family deleted:', data);
    } catch (error) {
        console.error('Error deleting family:', error);
    }
};
export { deleteFamily };