
async function fetchDonations() {
    try {
        const response = await fetch('http://localhost:3008/api/donations');
        const donations = await response.json();

        const tableBody = document.getElementById('donation-table-body');
        const noDonationsMsg = document.getElementById('no-donations-msg');

        if (response.ok && donations.length > 0) {
            donations.forEach(donation => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${donation.Donor_Name}</td>
                    <td>${donation.Food_Item}</td>
                    <td>${donation.Quantity}</td>
                    <td>${donation.Expiration_Date}</td>
                    <td>${donation.Additional_Comment || 'N/A'}</td>
                `;
                tableBody.appendChild(row);
            });
            noDonationsMsg.style.display = 'none';
        } else {
            noDonationsMsg.style.display = 'block';
        }
    } catch (err) {
        console.error('Error fetching donations:', err);
        document.getElementById('no-donations-msg').textContent = 'Failed to load donations.';
        document.getElementById('no-donations-msg').style.display = 'block';
    }
}

// Fetch donations when the page loads
document.addEventListener('DOMContentLoaded', fetchDonations);
