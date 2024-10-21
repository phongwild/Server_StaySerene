const apiDichVuUrl = 'http://192.168.0.8:3000/api/dichvu';

// Lấy tất cả danh sách dịch vụ
async function fetchAllDichVu() {
    try {
        const response = await fetch(apiDichVuUrl);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching all dich vu:', error);
        return [];
    }
}

// Hiển thị danh sách dịch vụ
async function renderDichVu() {
    const dichVuList = await fetchAllDichVu();
    const dichVuTable = document.getElementById('dichvu-list');
    dichVuTable.innerHTML = ''; // Xóa nội dung cũ

    dichVuList.forEach(dv => {
        const row = document.createElement('tr');
        row.setAttribute('data-id', dv._id);
        row.onclick = () => showDichVuDetails(dv);

        row.innerHTML = `
            <td>${dv._id}</td>
            <td>${dv.tenDichVu}</td>
            <td>${dv.giaDichVu}</td>
            <td>${dv.motaDichVu}</td>
            <td><img src="${dv.anhDichVu}" alt="${dv.tenDichVu}" width="50"></td>
        `;
        dichVuTable.appendChild(row);
    });
}

// Hiển thị chi tiết dịch vụ để sửa
async function showDichVuDetails(dv) {
    const { _id, tenDichVu, giaDichVu, motaDichVu, anhDichVu } = dv;

    document.getElementById('maDichVu').value = _id;
    document.getElementById('tenDichVu').value = tenDichVu || '';
    document.getElementById('giaDichVu').value = giaDichVu || '';
    document.getElementById('motaDichVu').value = motaDichVu || '';
    document.getElementById('anhDichVu').value = anhDichVu || '';
}

// Thêm dịch vụ
async function addDichVu() {
    const newDichVu = {
        tenDichVu: document.getElementById('tenDichVu').value.trim(),
        giaDichVu: parseFloat(document.getElementById('giaDichVu').value.trim()),
        motaDichVu: document.getElementById('motaDichVu').value.trim(),
        anhDichVu: document.getElementById('anhDichVu').value.trim(),
    };

    try {
        const response = await fetch(apiDichVuUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newDichVu)
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        await renderDichVu();
        alert('Thêm dịch vụ thành công');
        clearForm();
    } catch (error) {
        console.error('Error adding dich vu:', error);
    }
}

// Sửa dịch vụ
async function editDichVu() {
    const maDichVu = document.getElementById('maDichVu').value.trim();
    if (!maDichVu) {
        alert('Vui lòng chọn dịch vụ để sửa!');
        return;
    }

    const updatedDichVu = {
        tenDichVu: document.getElementById('tenDichVu').value.trim(),
        giaDichVu: parseFloat(document.getElementById('giaDichVu').value.trim()),
        motaDichVu: document.getElementById('motaDichVu').value.trim(),
        anhDichVu: document.getElementById('anhDichVu').value.trim(),
    };

    try {
        const response = await fetch(`${apiDichVuUrl}/${maDichVu}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedDichVu)
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        await renderDichVu();
        alert('Cập nhật dịch vụ thành công');
        clearForm();
    } catch (error) {
        console.error('Error updating dich vu:', error);
    }
}

// Xóa dịch vụ
async function deleteDichVu() {
    const maDichVu = document.getElementById('maDichVu').value.trim();
    if (!maDichVu) {
        alert('Vui lòng chọn dịch vụ để xóa!');
        return;
    }

    const confirmDelete = confirm('Bạn có chắc chắn muốn xóa dịch vụ này?');
    if (!confirmDelete) return;

    try {
        const response = await fetch(`${apiDichVuUrl}/${maDichVu}`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        await renderDichVu();
        alert('Xóa dịch vụ thành công');
        clearForm();
    } catch (error) {
        console.error('Error deleting dich vu:', error);
    }
}

// Xóa form
function clearForm() {
    document.getElementById('dichvu-form').reset();
    document.getElementById('maDichVu').value = ''; // Đặt lại ID
}

// Khi DOM đã tải xong, hiển thị danh sách dịch vụ
document.addEventListener('DOMContentLoaded', renderDichVu);