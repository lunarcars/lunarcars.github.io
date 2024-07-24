let chart;  // Declare the chart variable globally

function toggleInputs(section, enable) {
    const inputs = document.querySelectorAll(`#${section} input`);
    inputs.forEach(input => {
        if (input.id !== 'carsharingCost' && input.id !== 'maintenance') {
            input.disabled = !enable;
        }
    });

    if (section === 'owningCar') {
        const carPriceLabel = document.getElementById('carPriceLabel');
        carPriceLabel.textContent = enable ? 'Your Car Price ($):' : 'Average New Car Price ($):';
    }
}

function updateCarsharingCost() {
    const mileage = parseFloat(document.getElementById('mileage').value) || 0;
    const elapsedTime = parseFloat(document.getElementById('elapsedTime').value) || 0;
    const carsharingCost = (mileage * 0.13 + elapsedTime * 0.20).toFixed(2);
    document.getElementById('carsharingCost').value = carsharingCost;
}

function calculateCosts() {
    const carPrice = parseFloat(document.getElementById('carPrice').value);
    const insurance = parseFloat(document.getElementById('insurance').value) * 12;
    const fuel = parseFloat(document.getElementById('fuel').value) * 12;
    const maintenance = parseFloat(document.getElementById('maintenance').value);
    const carsharingCost = parseFloat(document.getElementById('carsharingCost').value) * 365;

    const owningCost = (carPrice + (insurance + fuel + maintenance) * 10).toFixed(2);
    const carsharingTotalCost = (carsharingCost * 10).toFixed(2);

    document.getElementById('results').innerHTML = `
        <h2>Results</h2>
        <p>Total Cost of Owning a Car over 10 years: <strong>$${owningCost}</strong></p>
        <p>Total Cost of Using Carsharing over 10 years: <strong>$${carsharingTotalCost}</strong></p>
    `;

    calculateInvestment(carPrice);
}

function calculateInvestment(initialAmount) {
    const years = 10;
    const growthRate = 0.08;
    const investmentValues = [initialAmount];
    for (let i = 1; i <= years; i++) {
        const lastValue = investmentValues[investmentValues.length - 1];
        investmentValues.push(lastValue * (1 + growthRate));
    }

    const finalAmount = investmentValues[investmentValues.length - 1].toFixed(2);
    const labels = Array.from({ length: years + 1 }, (_, i) => `Year ${i}`);
    const data = {
        labels: labels,
        datasets: [{
            label: 'Investment Value',
            data: investmentValues,
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 2,
            fill: false
        }]
    };

    if (chart) {
        chart.destroy();  // Destroy the existing chart instance if it exists
    }

    const ctx = document.getElementById('investmentGraph').getContext('2d');
    chart = new Chart(ctx, {
        type: 'line',
        data: data,
        options: {
            responsive: true,
            scales: {
                x: {
                    display: true,
                    title: {
                        display: true,
                        text: 'Years'
                    }
                },
                y: {
                    display: true,
                    title: {
                        display: true,
                        text: 'Value ($)'
                    }
                }
            }
        }
    });

    document.getElementById('investmentResult').innerHTML = `
        <p>You would have <strong>$${finalAmount}</strong> if you invested in the S&P 500 index fund instead of buying a car.</p>
    `;
}

// Display an empty graph on page load
window.onload = function() {
    const ctx = document.getElementById('investmentGraph').getContext('2d');
    chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: Array.from({ length: 11 }, (_, i) => `Year ${i}`),
            datasets: [{
                label: 'Investment Value',
                data: Array(11).fill(0),
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 2,
                fill: false
            }]
        },
        options: {
            responsive: true,
            scales: {
                x: {
                    display: true,
                    title: {
                        display: true,
                        text: 'Years'
                    }
                },
                y: {
                    display: true,
                    title: {
                        display: true,
                        text: 'Value ($)'
                    }
                }
            }
        }
    });

    // Ensure maintenance input is always disabled
    document.getElementById('maintenance').disabled = true;
}
