
function fetchTenants() {
    fetch('http://localhost:9091/api/tenants') 
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            const tableBody = document.querySelector('#tenantTable tbody');
            tableBody.innerHTML = '';

           
            data.forEach(tenant => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${tenant.name}</td>
                    <td>${tenant.email}</td>
                    <td>${tenant.phone}</td>
                    <td>
                        <button class="btn btn-warning" onclick="editTenant(${tenant.id}, '${tenant.name}', '${tenant.email}', '${tenant.phone}')">Edit</button>
                        <button class="btn btn-danger" onclick="deleteTenant(${tenant.id})">Delete</button>
                    </td>
                `;
                tableBody.appendChild(row);
            });
        })
        .catch(error => {
            console.error('Error fetching tenants:', error);
        });
}


fetchTenants();

document.getElementById('tenantForm').addEventListener('submit', function (event) {
    event.preventDefault(); 

    const tenantId = document.getElementById('tenantId').value;
    const tenantName = document.getElementById('tenantName').value;
    const tenantEmail = document.getElementById('tenantEmail').value;
    const tenantPhone = document.getElementById('tenantPhone').value;

   
    if (tenantId) {
        
        fetch(`http://localhost:9091/api/tenants/${tenantId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ tenantName, tenantEmail, tenantPhone })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log(data.message);
            fetchTenants();
            document.getElementById('tenantForm').reset();
            document.getElementById('tenantId').value = '';
        })
        .catch(error => {
            console.error('Error updating tenant:', error);
        });
    } else {
       
        fetch('http://localhost:9091/api/tenants', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ tenantName, tenantEmail, tenantPhone })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log(data.message);
            fetchTenants(); 
            document.getElementById('tenantForm').reset(); 
        })
        .catch(error => {
            console.error('Error adding tenant:', error);
        });
    }
});


function deleteTenant(id) {
    fetch(`http://localhost:9091/api/tenants/${id}`, {
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
        fetchTenants(); 
    })
    .catch(error => {
        console.error('Error deleting tenant:', error);
    });
}


function editTenant(id, name, email, phone) {
    document.getElementById('tenantId').value = id;
    document.getElementById('tenantName').value = name;
    document.getElementById('tenantEmail').value = email;
    document.getElementById('tenantPhone').value = phone;


    document.getElementById('tenantForm').scrollIntoView({ behavior: 'smooth' });
}
