document.addEventListener('DOMContentLoaded', function() {
  // Fetch and populate hotel select options
  fetch('http://192.168.1.4:3000/api/hotel')
      .then(response => response.json())
      .then(data => {
          const tenKhachsanSelect = document.getElementById('tenKhachsan');
          data.forEach(khachSan => {
              const option = document.createElement('option');
              option.value = khachSan._id.$oid || khachSan._id; // Ensure to handle ObjectId properly
              option.textContent = khachSan.tenKhachSan;
              tenKhachsanSelect.appendChild(option);
          });
      })
      .catch(error => console.error('Error fetching hotels:', error));

  // Add event listener for hotel selection
  document.getElementById('tenKhachsan').addEventListener('change', function(event) {
      const hotelId = event.target.value;
      if (hotelId) {
          fetch(`http://192.168.1.4:3000/api/revenue/${hotelId}`)
              .then(response => response.json())
              .then(data => {
                  updateBarChart(data);
                  updatePieChart(data);
              })
              .catch(error => console.error('Error fetching revenue data:', error));
      }
  });
});

function updateBarChart(data) {
  const ctxBar = document.getElementById('bieudoCot').getContext('2d');
  new Chart(ctxBar, {
      type: 'bar',
      data: {
          labels: data.labels,
          datasets: [{
              label: 'Doanh thu',
              data: data.revenue,
              backgroundColor: 'rgba(54, 162, 235, 0.2)',
              borderColor: 'rgba(54, 162, 235, 1)',
              borderWidth: 1
          }]
      },
      options: {
          scales: {
              y: {
                  beginAtZero: true
              }
          }
      }
  });
}

function updatePieChart(data) {
  const ctxPie = document.getElementById('bieudoTron').getContext('2d');
  new Chart(ctxPie, {
      type: 'pie',
      data: {
          labels: data.labels,
          datasets: [{
              label: 'Tỷ lệ doanh thu',
              data: data.revenue,
              backgroundColor: [
                  'rgba(255, 99, 132, 0.2)',
                  'rgba(54, 162, 235, 0.2)',
                  'rgba(255, 206, 86, 0.2)',
                  'rgba(75, 192, 192, 0.2)',
                  'rgba(153, 102, 255, 0.2)',
                  'rgba(255, 159, 64, 0.2)'
              ],
              borderColor: [
                  'rgba(255, 99, 132, 1)',
                  'rgba(54, 162, 235, 1)',
                  'rgba(255, 206, 86, 1)',
                  'rgba(75, 192, 192, 1)',
                  'rgba(153, 102, 255, 1)',
                  'rgba(255, 159, 64, 1)'
              ],
              borderWidth: 1
          }]
      }
  });
}
