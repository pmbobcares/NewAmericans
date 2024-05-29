const UpdateStudentFamily = async (updatedStudent) => {
    try {
        const response = await fetch(`http://34.16.206.128:3000/UpdateStudentFamily/${updatedStudent.StudentID}`, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedStudent),
        });
        const data = await response.json();
        console.log('Student family updated:', data);
    } catch (error) {
        console.error('Error updating student family:', error);
    }
};
export { UpdateStudentFamily };