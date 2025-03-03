let chart;

document.querySelectorAll('input').forEach(input => {
    input.addEventListener('input', updateCalculations);
});

function updateCalculations() {
    const initial = parseFloat(document.getElementById('initialValue').value);
    const rate = parseFloat(document.getElementById('inflationRate').value);
    const years = parseInt(document.getElementById('years').value);

    if (!initial || !rate || !years) return;

    // Calculate values
    const data = [];
    for (let year = 0; year <= years; year++) {
        data.push(initial * Math.pow(1 - rate/100, year));
    }

    // Update chart
    updateChart(data, years);
    
    // Update table
    updateTable(data);
    
    // Update sentences
    updateSentences(initial, rate, years, data);
}

function updateChart(data, years) {
    const ctx = document.getElementById('chart').getContext('2d');
    
    if (chart) chart.destroy();

    chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: Array.from({length: data.length}, (_, i) => i),
            datasets: [{
                label: 'Value Over Time',
                data: data,
                borderColor: '#2ecc71',
                tension: 0.1,
                pointRadius: 3,
                pointBackgroundColor: '#2ecc71'
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { display: false },
                title: {
                    display: true,
                    text: 'Value Over Time',
                    color: '#ffffff',
                    font: { size: 20 }
                }
            },
            scales: {
                x: {
                    title: { display: true, text: 'Years', color: '#ffffff', font: { size: 16 } },
                    grid: { color: '#363636' },
                    ticks: { color: '#ffffff' }
                },
                y: {
                    title: { display: true, text: 'Value (£)', color: '#ffffff', font: { size: 16 } },
                    grid: { color: '#363636' },
                    ticks: { color: '#ffffff' }
                }
            }
        }
    });
}

function updateTable(data) {
    const tbody = document.querySelector('#dataTable tbody');
    tbody.innerHTML = '';
    
    data.forEach((value, year) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${year}</td>
            <td>£${value.toFixed(2)}</td>
        `;
        tbody.appendChild(row);
    });
}

function updateSentences(initial, rate, years, data) {
    const finalValue = data[years];
    const percentageLoss = ((initial - finalValue) / initial * 100).toFixed(1);
    
    // Calculate years to halve
    const halfLife = Math.log(0.5) / Math.log(1 - rate/100);
    const currentValue = initial * Math.pow(1 - rate/100, years);
    
    const sentencesHTML = `
        <p>In <span class="highlight">${years} years</span>, £<span class="highlight">${initial}</span> would lose <span class="highlight">${percentageLoss}%</span> of its purchasing power.</p>
        <p>In <span class="highlight">${years} years</span>, £<span class="highlight">${initial}</span> would be worth £<span class="highlight">${finalValue.toFixed(2)}</span>, assuming a <span class="highlight">${rate}%</span> inflation rate.</p>
        <p>At a <span class="highlight">${rate}%</span> inflation rate, £<span class="highlight">${initial}</span> is worth half as much after <span class="highlight">${halfLife.toFixed(1)}</span> years.</p>
`;
    
    document.getElementById('sentences').innerHTML = sentencesHTML;
}