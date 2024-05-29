const putProduct = async (updatedProduct) => {
    try {
        const response = await fetch(`http://34.16.206.128:3000/PutProductData/${updatedProduct.ProductID}`, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedProduct),
        });
        const data = await response.json();
        console.log('Product updated:', data);
    } catch (error) {
        console.error('Error updating product:', error);
    }
};
export { putProduct };