const deleteCategory = async (category) => {
    try {
        const response = await fetch(`http://34.16.206.128:3000/DeleteCategory/${category.CategoryID}`, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
        });
        const data = await response.json();
        console.log('Category deleted:', data);
    } catch (error) {
        console.error('Error deleting category:', error);
    }
};
export { deleteCategory };