//fetch
function fetchProperties() {
    fetch('http://localhost:9091/api/properties')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            const tableBody = document.querySelector('#propertyTable tbody');
            tableBody.innerHTML = '';
            data.forEach(property => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${property.name}</td>
                    <td>${property.address}</td>
                    <td>${property.price}</td>
                    <td>
                        <button class="btn btn-warning" onclick="editProperty(${property.id}, '${property.name}', '${property.address}', ${property.price})">Edit</button>
                        <button class="btn btn-danger" onclick="deleteProperty(${property.id})">Delete</button>
                    </td>
                `;
                tableBody.appendChild(row);
            });
        })
        .catch(error => {
            console.error('Error fetching properties:', error);
        });
}

fetchProperties();

//  add or update 
document.getElementById('propertyForm').addEventListener('submit', function (event) {
    event.preventDefault(); 

    const propertyId = document.getElementById('propertyId').value; 
    const propertyName = document.getElementById('propertyName').value;
    const propertyAddress = document.getElementById('propertyAddress').value;
    const propertyPrice = document.getElementById('propertyPrice').value;

    if (propertyId) {
        // Update existing property
        fetch(`http://localhost:9091/api/properties/${propertyId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ propertyName, propertyAddress, propertyPrice })
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
            document.getElementById('propertyId').value = ''; // Reset hidden input for propertyId
        })
        .catch(error => {
            console.error('Error updating property:', error);
        });
    } else {
        // Create new property
        fetch('http://localhost:9091/api/properties', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ propertyName, propertyAddress, propertyPrice })
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
    }
});

// Function to delete a property
function deleteProperty(id) {
    fetch(`http://localhost:9091/api/properties/${id}`, {
        method: 'DELETE'
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        console.log(data.message);
        fetchProperties(); 
    })
    .catch(error => {
        console.error('Error deleting property:', error);
    });
}

// Function to set the form for editing a property
function editProperty(id, name, address, price) {
    document.getElementById('propertyId').value = id; 
    document.getElementById('propertyName').value = name;
    document.getElementById('propertyAddress').value = address;
    document.getElementById('propertyPrice').value = price;


    document.getElementById('propertyForm').scrollIntoView({ behavior: 'smooth' });
}
