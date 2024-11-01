const apiHotelUrl = 'http://192.168.1.4:3000/api/hotel';
const apiTyperoomUrl = 'http://192.168.1.4:3000/api/typeroom';
const apiRoomUrl = 'http://192.168.1.4:3000/api/rooms';
const apiOrderRoomUrl = 'http://192.168.1.4:3000/api/orderroom';

function fetchHotels() {
    fetch(apiHotelUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            const selectElement = document.getElementById('tenKhachsan');
            data.forEach(hotel => {
                const option = document.createElement('option');
                option.value = hotel._id;
                option.textContent = hotel.tenKhachSan; 
                selectElement.appendChild(option);
            });
        })
        .catch(error => console.error('There was a problem with the fetch operation:', error));
}

function fetchHotels() {
    fetch(apiHotelUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            const selectElement = document.getElementById('tenKhachsan');
            data.forEach(hotel => {
                const option = document.createElement('option');
                option.value = hotel._id;  // Assuming hotel ID is stored in _id
                option.textContent = hotel.tenKhachSan; 
                selectElement.appendChild(option);
            });
        })
        .catch(error => console.error('There was a problem with the fetch operation:', error));
}

function fetchRevenueByYear() {
    const selectedHotelId = document.getElementById('tenKhachsan').value;

    fetch(apiOrderRoomUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            const filteredOrders = selectedHotelId
                ? data.filter(order => order.IdKhachSan === selectedHotelId) // Adjust according to your schema
                : data;

            const revenueByYear = {};

            filteredOrders.forEach(order => {
                const year = new Date(order.orderTime).getFullYear(); // Assuming 'orderTime' contains the booking date
                const totalRevenue = order.total || 0; // Assuming 'total' contains the total revenue from the order

                if (!revenueByYear[year]) {
                    revenueByYear[year] = 0;
                }
                revenueByYear[year] += totalRevenue;
            });

            // Prepare data for the chart
            const years = Object.keys(revenueByYear);
            const revenues = Object.values(revenueByYear);

            // Call function to render the chart
            renderRevenueChart(years, revenues);
        })
        .catch(error => console.error('There was a problem with the fetch operation:', error));
}

// Function to render revenue chart
function renderRevenueChart(years, revenues) {
    const ctx = document.getElementById('bieudoCot').getContext('2d');

    // Clear previous chart if it exists
    if (window.revenueChart) {
        window.revenueChart.destroy();
    }

    window.revenueChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: years,
            datasets: [{
                label: 'Doanh thu theo năm',
                data: revenues,
                backgroundColor: 'rgba(76, 77, 220, 0.5)',
                borderColor: 'rgba(76, 77, 220, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Doanh thu (VND)'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Năm'
                    }
                }
            }
        }
    });
}
function fetchRevenueByQuarter() {
    const selectedHotelId = document.getElementById('tenKhachsan').value;

    fetch(apiOrderRoomUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            const filteredOrders = selectedHotelId
                ? data.filter(order => order.IdKhachSan === selectedHotelId) // Ensure correct comparison
                : data;

            const revenueByQuarter = {};

            filteredOrders.forEach(order => {
                const date = new Date(order.orderTime);
                const month = date.getMonth(); // 0 (Jan) to 11 (Dec)
                const year = date.getFullYear();

                // Determine the quarter
                const quarter = Math.floor(month / 3) + 1; // 1 for Q1, 2 for Q2, etc.

                const quarterKey = `Q${quarter} ${year}`;

                const totalRevenue = order.total; // Use total from the order

                if (!revenueByQuarter[quarterKey]) {
                    revenueByQuarter[quarterKey] = 0;
                }
                revenueByQuarter[quarterKey] += totalRevenue;
            });

            // Prepare data for the chart
            const quarters = Object.keys(revenueByQuarter);
            const revenues = Object.values(revenueByQuarter);

            // Call function to render the chart
            renderRevenueChart(quarters, revenues);
        })
        .catch(error => console.error('There was a problem with the fetch operation:', error));
}
function fetchRevenueByMonth() {
    const selectedHotelId = document.getElementById('tenKhachsan').value;

    fetch(apiOrderRoomUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            const filteredOrders = selectedHotelId
                ? data.filter(order => order.IdKhachSan === selectedHotelId) // Ensure correct comparison
                : data;

            const revenueByMonth = {};

            filteredOrders.forEach(order => {
                const date = new Date(order.orderTime);
                const month = date.getMonth(); // 0 (Jan) to 11 (Dec)
                const year = date.getFullYear();
                
                const monthKey = `${month + 1}/${year}`; // Format: "MM/YYYY"

                const totalRevenue = order.total; // Use total from the order

                if (!revenueByMonth[monthKey]) {
                    revenueByMonth[monthKey] = 0;
                }
                revenueByMonth[monthKey] += totalRevenue;
            });

            // Prepare data for the chart
            const months = Object.keys(revenueByMonth);
            const revenues = Object.values(revenueByMonth);

            // Call function to render the chart
            renderRevenueChart(months, revenues);
        })
        .catch(error => console.error('There was a problem with the fetch operation:', error));
}
function fetchRevenueBySeason() {
    const selectedHotelId = document.getElementById('tenKhachsan').value;

    fetch(apiOrderRoomUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            const filteredOrders = selectedHotelId
                ? data.filter(order => order.IdKhachSan === selectedHotelId) // Ensure correct comparison
                : data;

            const revenueBySeason = {
                Spring: 0,
                Summer: 0,
                Autumn: 0,
                Winter: 0
            };

            filteredOrders.forEach(order => {
                const date = new Date(order.orderTime);
                const month = date.getMonth(); // 0 (Jan) to 11 (Dec)

                // Determine the season based on the month
                if (month === 2 || month === 3 || month === 4) { // March, April, May
                    revenueBySeason.Spring += order.total;
                } else if (month === 5 || month === 6 || month === 7) { // June, July, August
                    revenueBySeason.Summer += order.total;
                } else if (month === 8 || month === 9 || month === 10) { // September, October, November
                    revenueBySeason.Autumn += order.total;
                } else { // December, January, February
                    revenueBySeason.Winter += order.total;
                }
            });

            // Prepare data for the chart
            const seasons = Object.keys(revenueBySeason);
            const revenues = Object.values(revenueBySeason);

            // Call function to render the chart
            renderRevenueChart(seasons, revenues);
        })
        .catch(error => console.error('There was a problem with the fetch operation:', error));
}
function fetchRevenueByRoomType() {
    const selectedHotelId = document.getElementById('tenKhachsan').value;

    // Fetch order data
    fetch(apiOrderRoomUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(orderData => {
            // Filter orders by selected hotel
            const filteredOrders = selectedHotelId 
                ? orderData.filter(order => order.IdKhachSan === selectedHotelId) 
                : orderData;

            // Fetch room data to associate with room types
            return fetch(apiRoomUrl)
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.json();
                })
                .then(roomData => {
                    const revenueByRoomType = {};
                    
                    // Map room types to their IDs
                    const roomTypeMapping = {};
                    roomData.forEach(room => {
                        roomTypeMapping[room._id] = room.IdLoaiPhong; // Get IdLoaiPhong from each room
                    });

                    // Fetch room types for mapping names
                    fetch('http://192.168.1.4:3000/api/typeroom') // Assuming this is the endpoint for room types
                        .then(response => {
                            if (!response.ok) {
                                throw new Error('Network response was not ok');
                            }
                            return response.json();
                        })
                        .then(typeRoomData => {
                            const typeRoomNames = {};
                            typeRoomData.forEach(type => {
                                typeRoomNames[type._id] = type.tenLoaiPhong; // Map IdLoaiPhong to tenLoaiPhong
                            });

                            // Calculate revenue by room type
                            filteredOrders.forEach(order => {
                                const roomId = order.IdPhong;
                                const roomTypeId = roomTypeMapping[roomId]; // Get IdLoaiPhong from roomId
                                const roomTypeName = typeRoomNames[roomTypeId]; // Get room type name

                                if (roomTypeName) {
                                    const totalRevenue = order.total; // Total revenue from the booking

                                    if (!revenueByRoomType[roomTypeName]) {
                                        revenueByRoomType[roomTypeName] = 0;
                                    }
                                    revenueByRoomType[roomTypeName] += totalRevenue;
                                }
                            });

                            // Prepare data for the chart
                            const roomTypes = Object.keys(revenueByRoomType);
                            const revenues = Object.values(revenueByRoomType);

                            // Call function to render the chart
                            renderRevenueChart(roomTypes, revenues);
                        });
                });
        })
        .catch(error => console.error('There was a problem with the fetch operation:', error));
}

function fetchRevenueByHotel() {
    fetch(apiOrderRoomUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(orderData => {
            // Create a map to store revenue by hotel
            const revenueByHotel = {};

            // Fetch room data to get IdLoaiPhong
            return fetch(apiRoomUrl)
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.json();
                })
                .then(roomData => {
                    // Create a map for quick access to room type by room ID
                    const roomTypeMapping = {};
                    roomData.forEach(room => {
                        roomTypeMapping[room._id] = room.IdLoaiPhong; // Map room ID to IdLoaiPhong
                    });

                    // Fetch room type data to get hotel IDs
                    return fetch(apiTyperoomUrl)
                        .then(response => {
                            if (!response.ok) {
                                throw new Error('Network response was not ok');
                            }
                            return response.json();
                        })
                        .then(typeRoomData => {
                            // Create a map to get hotel ID by room type ID
                            const hotelMapping = {};
                            typeRoomData.forEach(type => {
                                hotelMapping[type._id] = type.IdKhachSan; // Map IdLoaiPhong to IdKhachSan
                            });

                            // Calculate revenue for each hotel
                            orderData.forEach(order => {
                                const roomId = order.IdPhong; // Get the room ID from the order
                                const roomTypeId = roomTypeMapping[roomId]; // Get the room type ID
                                const hotelId = hotelMapping[roomTypeId]; // Get the hotel ID

                                if (hotelId) {
                                    const totalRevenue = order.total || 0; // Assuming 'total' contains the revenue

                                    if (!revenueByHotel[hotelId]) {
                                        revenueByHotel[hotelId] = 0;
                                    }
                                    revenueByHotel[hotelId] += totalRevenue;
                                }
                            });

                            // Prepare data for the chart
                            const hotels = Object.keys(revenueByHotel);
                            const revenues = Object.values(revenueByHotel);

                            // Fetch hotel names for better representation
                            return fetch(apiHotelUrl)
                                .then(response => {
                                    if (!response.ok) {
                                        throw new Error('Network response was not ok');
                                    }
                                    return response.json();
                                })
                                .then(hotelData => {
                                    const hotelNames = {};
                                    hotelData.forEach(hotel => {
                                        hotelNames[hotel._id] = hotel.tenKhachSan; // Map hotel IDs to their names
                                    });

                                    // Map hotel revenue to their names
                                    const labeledRevenues = hotels.map(hotelId => hotelNames[hotelId] || hotelId);
                                    renderRevenueCharthotels(labeledRevenues, revenues);
                                });
                        });
                });
        })
        .catch(error => console.error('There was a problem with the fetch operation:', error));
}

// Function to render revenue chart
function renderRevenueCharthotels(hotels, revenues) {
    const ctx = document.getElementById('bieudoCot').getContext('2d');

    // Clear previous chart if it exists
    if (window.revenueChart) {
        window.revenueChart.destroy();
    }

    window.revenueChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: hotels,
            datasets: [{
                label: 'Doanh thu theo khách sạn',
                data: revenues,
                backgroundColor: 'rgba(76, 77, 220, 0.5)',
                borderColor: 'rgba(76, 77, 220, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Doanh thu (VND)'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Khách sạn'
                    }
                }
            }
        }
    });
}


document.addEventListener('DOMContentLoaded', function () {
    fetchHotels();
    fetchRevenueByHotel(); 
});
