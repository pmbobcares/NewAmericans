const deleteProduct = async (product) => {
    try {
        const response = await fetch(`http://34.16.206.128:3000/DeleteProduct/${product.ProductID}`, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
        });
        const data = await response.json();
        console.log('Product deleted:', data);
        // Optionally, you can update your local state or perform other actions after successful removal
    } catch (error) {
        console.error('Error deleting product:', error);
        // Handle error, show message to user, etc.
    }
};
export { deleteProduct };