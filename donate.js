
document.getElementById('donation-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const donorName = document.getElementById('donor-name').value;
    const foodItem = document.getElementById('food-item').value;
    const quantity = document.getElementById('quantity').value;
    const expirationDate = document.getElementById('expiration-date').value;
    const comments = document.getElementById('comments').value;

    try {
        const response = await fetch('http://localhost:3008/api/donate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ donorName, foodItem, quantity, expirationDate, comments })
        });

        const data = await response.json();
                document.getElementById('response-msg').textContent = data.message || 'Donation submitted successfully.';
            } catch (error) {
                document.getElementById('response-msg').textContent = 'Error submitting donation: ' + error.message;
            }
        });