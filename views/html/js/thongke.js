const apiHotelUrl = 'https://stayserene.vercel.app/api/hotel';
const apiTyperoomUrl = 'https://stayserene.vercel.app/api/typeroom';
const apiRoomUrl = 'https://stayserene.vercel.app/api/rooms';
const apiOrderRoomUrl = 'https://stayserene.vercel.app/api/orderroom/status3';

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

function showProgressBar() {
    const progressBar = document.getElementById('progressBar');
    const progressBarFill = document.getElementById('progressBarFill');
    progressBar.style.display = 'block';
    progressBarFill.style.width = '0%';

    let width = 0;
    const interval = setInterval(() => {
        if (width >= 90) { // Giới hạn đến 90% khi đang load
            clearInterval(interval);
        } else {
            width += 10;
            progressBarFill.style.width = width + '%';
        }
    }, 300);
}

function hideProgressBar() {
    const progressBar = document.getElementById('progressBar');
    const progressBarFill = document.getElementById('progressBarFill');
    progressBarFill.style.width = '100%';
    setTimeout(() => {
        progressBar.style.display = 'none';
    }, 500); // Ẩn sau khi hoàn thành
}

function fetchRevenueByYear() {
    showProgressBar()
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
                ? data.filter(order => order.IdKhachSan === selectedHotelId)
                : data;

            const revenueByYear = {};

            filteredOrders.forEach(order => {
                const formattedTime = formatOrderTime(order.orderTime);
                const year = new Date(formattedTime).getFullYear();
                const totalRevenue = order.total || 0;

                if (!revenueByYear[year]) {
                    revenueByYear[year] = 0;
                }
                revenueByYear[year] += totalRevenue;
            });

            const years = Object.keys(revenueByYear);
            const revenues = Object.values(revenueByYear);

            renderRevenueChart(years, revenues);
            //renderRevenueChartbdt(years, revenues);
        })
        .catch(error => console.error('There was a problem with the fetch operation:', error))
        .finally(() => hideProgressBar());
}

function formatOrderTime(orderTime) {
    const [time, date] = orderTime.split(' ');
    const [hh, mm, ss] = time.split(':');
    const [dd, MM, yyyy] = date.split('/');

    return `${yyyy}-${MM}-${dd}T${hh}:${mm}:${ss}Z`;
}

function renderRevenueChart(years, revenues) {
    const ctx = document.getElementById('bieudoCot').getContext('2d');
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

function fetchRevenueByDateRange() {
    const selectedHotelId = document.getElementById('tenKhachsan').value;
    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;

    if (!startDate || !endDate) {
        alert("Vui lòng chọn ngày bắt đầu và ngày kết thúc!");
        return;
    }

    // Hiển thị progress bar
    showProgressBar();

    fetch(apiOrderRoomUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Không thể lấy dữ liệu từ API. Vui lòng thử lại!');
            }
            return response.json();
        })
        .then(data => {
            // Lọc dữ liệu theo khoảng thời gian
            const filteredOrders = data.filter(order => {
                const orderDate = new Date(formatOrderTime(order.orderTime)); // Chuyển thành đối tượng Date
                const start = new Date(startDate);
                const end = new Date(endDate);

                return orderDate >= start && orderDate <= end &&
                    (!selectedHotelId || order.IdKhachSan === selectedHotelId);
            });

            // Tính tổng doanh thu theo ngày
            const revenueByDate = {};

            filteredOrders.forEach(order => {
                const orderDate = new Date(formatOrderTime(order.orderTime));
                const dateKey = orderDate.toISOString().split('T')[0]; // yyyy-mm-dd
                const totalRevenue = order.total || 0;

                if (!revenueByDate[dateKey]) {
                    revenueByDate[dateKey] = 0;
                }
                revenueByDate[dateKey] += totalRevenue;
            });

            // Hiển thị biểu đồ
            const dates = Object.keys(revenueByDate);
            const revenues = Object.values(revenueByDate);
            renderChart(dates, revenues, 'Doanh thu theo ngày');
        })
        .catch(error => {
            console.error('Đã xảy ra lỗi:', error);
            alert('Có lỗi xảy ra trong quá trình tải dữ liệu. Vui lòng thử lại sau!');
        })
        .finally(() => {
            // Ẩn progress bar
            hideProgressBar();
        });
}



function fetchRevenueByQuarter() {
    const selectedHotelId = document.getElementById('tenKhachsan').value;
    showProgressBar()
    fetch(apiOrderRoomUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            const filteredOrders = selectedHotelId
                ? data.filter(order => order.IdKhachSan === selectedHotelId)
                : data;

            const revenueByQuarter = {};

            filteredOrders.forEach(order => {
                const formattedTime = formatOrderTime(order.orderTime);
                const date = new Date(formattedTime);
                const month = date.getMonth();
                const year = date.getFullYear();

                const quarter = Math.floor(month / 3) + 1;
                const quarterKey = `Q${quarter} ${year}`;

                const totalRevenue = order.total || 0;

                if (!revenueByQuarter[quarterKey]) {
                    revenueByQuarter[quarterKey] = 0;
                }
                revenueByQuarter[quarterKey] += totalRevenue;
            });

            const quarters = Object.keys(revenueByQuarter);
            const revenues = Object.values(revenueByQuarter);

            renderRevenueChartq(quarters, revenues);
        })
        .catch(error => console.error('There was a problem with the fetch operation:', error))
        .finally(() => hideProgressBar());
}

function renderRevenueChartq(quarters, revenues) {
    const ctx = document.getElementById('bieudoCot').getContext('2d');
    if (window.revenueChart) {
        window.revenueChart.destroy();
    }

    window.revenueChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: quarters,
            datasets: [{
                label: 'Doanh thu theo quý',
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
                        text: 'Quý'
                    }
                }
            }
        }
    });
}

function fetchRevenueByMonth() {
    const selectedHotelId = document.getElementById('tenKhachsan').value;
    showProgressBar()
    fetch(apiOrderRoomUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            const filteredOrders = selectedHotelId
                ? data.filter(order => order.IdKhachSan === selectedHotelId)
                : data;

            const revenueByMonth = {};

            filteredOrders.forEach(order => {
                // Format the order time before creating a date object
                const formattedTime = formatOrderTime(order.orderTime);
                const date = new Date(formattedTime);
                const month = date.getMonth();
                const year = date.getFullYear();

                const monthKey = `${month + 1}/${year}`;

                const totalRevenue = order.total || 0;

                if (!revenueByMonth[monthKey]) {
                    revenueByMonth[monthKey] = 0;
                }
                revenueByMonth[monthKey] += totalRevenue;
            });

            const months = Object.keys(revenueByMonth);
            const revenues = Object.values(revenueByMonth);

            renderRevenueChartt(months, revenues);
        })
        .catch(error => console.error('There was a problem with the fetch operation:', error))
        .finally(() => hideProgressBar());
}
function renderChart(labels, data, chartLabel) {
    const ctx = document.getElementById('bieudoCot').getContext('2d');
    
    // Kiểm tra và phá hủy biểu đồ cũ (nếu có)
    if (window.revenueChart) {
        window.revenueChart.destroy();
    }

    // Tạo biểu đồ mới
    window.revenueChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels, // Trục X
            datasets: [{
                label: chartLabel, // Tên biểu đồ
                data: data, // Dữ liệu trục Y
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
                        text: 'Thời gian'
                    }
                }
            }
        }
    });
}


function renderRevenueChartt(months, revenues) {
    const ctx = document.getElementById('bieudoCot').getContext('2d');
    if (window.revenueChart) {
        window.revenueChart.destroy();
    }

    window.revenueChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: months,
            datasets: [{
                label: 'Doanh thu theo Tháng',
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
                        text: 'Tháng'
                    }
                }
            }
        }
    });
}

function fetchRevenueBySeason() {
    const selectedHotelId = document.getElementById('tenKhachsan').value;
    showProgressBar()
    fetch(apiOrderRoomUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            const filteredOrders = selectedHotelId
                ? data.filter(order => order.IdKhachSan === selectedHotelId)
                : data;

            const revenueBySeason = {
                Spring: 0,
                Summer: 0,
                Autumn: 0,
                Winter: 0
            };

            filteredOrders.forEach(order => {
                const formattedTime = formatOrderTime(order.orderTime);
                const date = new Date(formattedTime);
                const month = date.getMonth();

                if (month === 2 || month === 3 || month === 4) {
                    revenueBySeason.Spring += order.total || 0;
                } else if (month === 5 || month === 6 || month === 7) {
                    revenueBySeason.Summer += order.total || 0;
                } else if (month === 8 || month === 9 || month === 10) {
                    revenueBySeason.Autumn += order.total || 0;
                } else {
                    revenueBySeason.Winter += order.total || 0;
                }
            });

            const seasons = Object.keys(revenueBySeason);
            const revenues = Object.values(revenueBySeason);

            renderRevenueChartm(seasons, revenues);
        })
        .catch(error => console.error('There was a problem with the fetch operation:', error))
        .finally(() => hideProgressBar());
}


function renderRevenueChartm(seasons, revenues) {
    const ctx = document.getElementById('bieudoCot').getContext('2d');
    if (window.revenueChart) {
        window.revenueChart.destroy();
    }

    window.revenueChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: seasons,
            datasets: [{
                label: 'Doanh thu theo Mùa',
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
                        text: 'Mùa'
                    }
                }
            }
        }
    });
}

function fetchRevenueByRoomType() {
    const selectedHotelId = document.getElementById('tenKhachsan').value;
    showProgressBar()
    fetch(apiOrderRoomUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(orderData => {
            const filteredOrders = selectedHotelId
                ? orderData.filter(order => order.IdKhachSan === selectedHotelId)
                : orderData;

            return fetch(apiRoomUrl)
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.json();
                })
                .then(roomData => {
                    const roomTypeMapping = {};
                    roomData.forEach(room => {
                        roomTypeMapping[room._id] = room.IdLoaiPhong;
                    });

                    return fetch(apiTyperoomUrl)
                        .then(response => {
                            if (!response.ok) {
                                throw new Error('Network response was not ok');
                            }
                            return response.json();
                        })
                        .then(typeRoomData => {
                            const typeRoomMapping = {};
                            typeRoomData.forEach(type => {
                                typeRoomMapping[type._id] = {
                                    name: type.tenLoaiPhong,
                                    hotelId: type.IdKhachSan
                                };
                            });
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
                                        hotelNames[hotel._id] = hotel.tenKhachSan;
                                    });

                                    const revenueByRoomType = {};

                                    filteredOrders.forEach(order => {
                                        const roomId = order.IdPhong;
                                        const roomTypeId = roomTypeMapping[roomId];
                                        const roomTypeInfo = typeRoomMapping[roomTypeId];
                                        if (roomTypeInfo) {
                                            const totalRevenue = order.total;
                                            const hotelId = roomTypeInfo.hotelId;
                                            const hotelName = hotelNames[hotelId];
                                            const label = `${roomTypeInfo.name} - ${hotelName} `;

                                            if (!revenueByRoomType[label]) {
                                                revenueByRoomType[label] = 0;
                                            }
                                            revenueByRoomType[label] += totalRevenue;
                                        }
                                    });
                                    const labels = Object.keys(revenueByRoomType);
                                    const revenues = Object.values(revenueByRoomType);
                                    renderRevenueChartlp(labels, revenues);
                                });
                        });
                });
        })
        .catch(error => console.error('There was a problem with the fetch operation:', error))
        .finally(() => hideProgressBar());
}
function renderRevenueChartlp(years, revenues) {
    const ctx = document.getElementById('bieudoCot').getContext('2d');
    if (window.revenueChart) {
        window.revenueChart.destroy();
    }

    window.revenueChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: years,
            datasets: [{
                label: 'Doanh thu theo Loại phòng',
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
                        text: 'Loại Phòng'
                    }
                }
            }
        }
    });
}

function fetchRevenueByHotel() {
    showProgressBar()
    fetch(apiOrderRoomUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(orderData => {
            const revenueByHotel = {};

            return fetch(apiRoomUrl)
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.json();
                })
                .then(roomData => {
                    const roomTypeMapping = {};
                    roomData.forEach(room => {
                        roomTypeMapping[room._id] = room.IdLoaiPhong;
                    });

                    return fetch(apiTyperoomUrl)
                        .then(response => {
                            if (!response.ok) {
                                throw new Error('Network response was not ok');
                            }
                            return response.json();
                        })
                        .then(typeRoomData => {
                            const hotelMapping = {};
                            typeRoomData.forEach(type => {
                                hotelMapping[type._id] = type.IdKhachSan;
                            });

                            orderData.forEach(order => {
                                const roomId = order.IdPhong;
                                const roomTypeId = roomTypeMapping[roomId];
                                const hotelId = hotelMapping[roomTypeId];

                                if (hotelId) {
                                    const totalRevenue = order.total || 0;

                                    if (!revenueByHotel[hotelId]) {
                                        revenueByHotel[hotelId] = 0;
                                    }
                                    revenueByHotel[hotelId] += totalRevenue;
                                }
                            });

                            const hotels = Object.keys(revenueByHotel);
                            const revenues = Object.values(revenueByHotel);

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
                                        hotelNames[hotel._id] = hotel.tenKhachSan;
                                    });

                                    const labeledRevenues = hotels.map(hotelId => hotelNames[hotelId] || hotelId);
                                    renderRevenueCharthotels(labeledRevenues, revenues);
                                });
                        })
                        .finally(() => hideProgressBar());
                });
        })
        .catch(error => console.error('There was a problem with the fetch operation:', error));
}

function renderRevenueCharthotels(hotels, revenues) {
    const ctx = document.getElementById('bieudoCot').getContext('2d');

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
function fetchRevenueByYearks() {
    showProgressBar
    fetch(apiOrderRoomUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            const filteredOrders = data.filter(order => {
                const roomId = order.IdPhong;

                return fetch(apiRoomUrl)
                    .then(roomResponse => {
                        if (!roomResponse.ok) {
                            throw new Error('Network response was not ok');
                        }
                        return roomResponse.json();
                    })
                    .then(roomData => {
                        const room = roomData.find(r => r._id === roomId);
                        if (room) {
                            return fetch(apiTyperoomUrl)
                                .then(typeRoomResponse => {
                                    if (!typeRoomResponse.ok) {
                                        throw new Error('Network response was not ok');
                                    }
                                    return typeRoomResponse.json();
                                })
                                .then(typeRoomData => {
                                    const typeRoom = typeRoomData.find(type => type._id === room.IdLoaiPhong);
                                    return typeRoom && typeRoom.IdKhachSan === selectedHotelId;
                                });
                        }
                        return false;
                    })
                    .finally(() => hideProgressBar());
            });

            const revenueByYear = {};
            Promise.all(filteredOrders).then(results => {
                results.forEach(order => {
                    const year = new Date(order.orderTime).getFullYear();
                    const totalRevenue = order.total || 0;

                    if (!revenueByYear[year]) {
                        revenueByYear[year] = 0;
                    }
                    revenueByYear[year] += totalRevenue;
                });

                const years = Object.keys(revenueByYear);
                const revenues = Object.values(revenueByYear);
                renderRevenueChart(years, revenues);
            });
        })
        .catch(error => console.error('There was a problem with the fetch operation:', error));
}


document.addEventListener('DOMContentLoaded', function () {
    fetchHotels();
    fetchRevenueByHotel();
    const hotelSelect = document.getElementById('tenKhachsan');
    hotelSelect.addEventListener('change', function () {
        fetchRevenueByYearks();
    });
    // Gán sự kiện cho nút thống kê theo khoảng ngày
    document.getElementById('startDate').addEventListener('change', validateDateInputs);
    document.getElementById('endDate').addEventListener('change', validateDateInputs);
});
// Kiểm tra tính hợp lệ của ngày bắt đầu và kết thúc
function validateDateInputs() {
    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;

    if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
        alert("Ngày bắt đầu không thể lớn hơn ngày kết thúc!");
    }
}
function confirmLogout(event) {
    event.preventDefault();
    const userConfirmed = confirm("Bạn có chắc chắn muốn đăng xuất?");

    if (userConfirmed) {
        window.location.href = "../../welcome.html";
    }
}

