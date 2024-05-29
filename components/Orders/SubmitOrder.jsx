const SubmitOrder = async (selectedAdmin, selectedStudent, cartItemsWithQuantity) => {

    const StudentID = selectedStudent.StudentID;
    const AdminID = selectedAdmin.AdminID;    
    const orderItems = cartItemsWithQuantity.map(item => ({ ProductID: item.ProductID, Quantity: item.Quantity }));
    console.log(StudentID)
    console.log(AdminID)
    console.log(orderItems)

    try {
        const response = await fetch('http://34.16.206.128:3000/SubmitOrder', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ AdminID, StudentID, orderItems })  
        });
        if (response.ok) {
            const responseData = await response.json();
            console.log('Order submitted successfully:', responseData);
            return responseData;
        } else {
            const errorData = await response.json();
            console.error('Failed to submit order:', errorData);
            throw new Error('Failed to submit order');
        }
    } catch (error) {
        console.error('An error occurred while submitting the order:', error);
        throw error;
    }
};

export { SubmitOrder };