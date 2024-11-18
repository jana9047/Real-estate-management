document.getElementById('propertyForm').addEventListener('submit', function (event) {
    event.preventDefault(); // Prevent the default form submission

    const propertyName = document.getElementById('propertyName').value;
    const propertyAddress = document.getElementById('propertyAddress').value;
    const propertyPrice = document.getElementById('propertyPrice').value;

    // Debugging: Log the values to ensure they are not null
    console.log('Property Name:', propertyName);
    console.log('Property Address:', propertyAddress);
    console.log('Property Price:', propertyPrice);

    // Send the data to the API
    fetch('http://localhost:9091/api/properties', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name: propertyName, address: propertyAddress, price: propertyPrice })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        console.log(data.message);
        fetchProperties(); // Refresh the property list
        document.getElementById('propertyForm').reset(); // Reset form fields
    })
    .catch(error => {
        console.error('Error adding property:', error);
    });
});
