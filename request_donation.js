
document.getElementById('request-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const requesterName = document.getElementById('requester-name').value;
    const foodItem = document.getElementById('food-item').value;
    const quantity = document.getElementById('quantity').value;
    const urgency = document.getElementById('urgency').value;
    const comments = document.getElementById('comments').value;

    try {
        const response = await fetch('http://localhost:3008/api/request', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ requesterName, foodItem, quantity, urgency, comments })
        });

        const data = await response.json();
        document.getElementById('response-msg').textContent = data.message || 'request submitted successfully.';
    } catch (error) {
        document.getElementById('response-msg').textContent = 'Error submitting request: ' + error.message;
    }
});