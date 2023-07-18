// Get references to DOM elements
var tableViewButton = document.getElementById('tableViewButton');
var chartViewButton = document.getElementById('chartViewButton');
var tableContainer = document.getElementById('tableContainer');
var chartContainer = document.getElementById('chartContainer');
var chart = null; // Reference to the chart instance

// Event listeners for table and chart view buttons
tableViewButton.addEventListener('click', function() {
  showTable();
});

chartViewButton.addEventListener('click', function() {
  showChart();
});

// Fetch data from dummydata.json
fetch('dummydata.json')
  .then(response => response.json())
  .then(data => {
    // Render table initially
    renderTable(data);

    // Store data for chart rendering
    var chartData = data.map(item => ({
      year: item.year,
      medals: item.medals
    }));

    // Store years for chart labels
    var years = data.map(item => item.year);

    // Render chart if the chart view is active
    if (chartViewButton.classList.contains('active')) {
      renderChart(chartData, years);
    }
  })
  .catch(error => {
    console.error('Error:', error);
  });

// Function to show table view
function showTable() {
  tableViewButton.classList.add('active');
  chartViewButton.classList.remove('active');
  tableContainer.style.display = 'block';
  chartContainer.style.display = 'none';
}

// Function to show chart view
function showChart() {
  tableViewButton.classList.remove('active');
  chartViewButton.classList.add('active');
  tableContainer.style.display = 'none';
  chartContainer.style.display = 'block';

  // Fetch data if not fetched before
  if (!chart) {
    fetch('dummydata.json')
      .then(response => response.json())
      .then(data => {
        var chartData = data.map(item => ({
          year: item.year,
          medals: item.medals
        }));

        var years = data.map(item => item.year);

        renderChart(chartData, years);
      })
      .catch(error => {
        console.error('Error:', error);
      });
  }
}

// Function to render the table
function renderTable(data) {
  var table = document.createElement('table');
  table.classList.add('data-table');

  var thead = document.createElement('thead');
  var headerRow = document.createElement('tr');
  var idHeader = document.createElement('th');
  idHeader.textContent = 'ID';
  var yearHeader = document.createElement('th');
  yearHeader.textContent = 'Year';
  var medalsHeader = document.createElement('th');
  medalsHeader.textContent = 'Medals';

  headerRow.appendChild(idHeader);
  headerRow.appendChild(yearHeader);
  headerRow.appendChild(medalsHeader);
  thead.appendChild(headerRow);
  table.appendChild(thead);

  var tbody = document.createElement('tbody');
  data.forEach(item => {
    var dataRow = document.createElement('tr');
    var idCell = document.createElement('td');
    idCell.textContent = item.id;
    var yearCell = document.createElement('td');
    yearCell.textContent = item.year;
    var medalsCell = document.createElement('td');
    medalsCell.textContent = item.medals;

    dataRow.appendChild(idCell);
    dataRow.appendChild(yearCell);
    dataRow.appendChild(medalsCell);
    tbody.appendChild(dataRow);
  });

  table.appendChild(tbody);

  tableContainer.innerHTML = '';
  tableContainer.appendChild(table);
}

// Function to render the chart
function renderChart(data, years) {
    var chartCanvas = document.createElement('canvas');
    chartCanvas.id = 'lineChart';
    chartContainer.innerHTML = '';
    chartContainer.appendChild(chartCanvas);
  
    var ctx = chartCanvas.getContext('2d');
  
    // Chart data
    var chartData = {
      labels: years,
      datasets: [
        {
          label: 'Medals',
          data: data.map(item => item.medals),
          borderColor: 'rgba(75, 192, 192, 1)',
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          borderWidth: 1
        }
      ]
    };
  
    // Chart configuration options
    var chartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          display: true,
          title: {
            display: true,
            text: 'Year'
          }
        },
        y: {
          display: true,
          title: {
            display: true,
            text: 'No. of Medals'
          },
          ticks: {
            stepSize: 1,
            beginAtZero: true,
            max: Math.max(...data.map(item => item.medals)) + 1
          }
        }
      }
    };
  
    // Create the chart instance
    chart = new Chart(ctx, {
      type: 'line',
      data: chartData,
      options: chartOptions
    });
  }
  