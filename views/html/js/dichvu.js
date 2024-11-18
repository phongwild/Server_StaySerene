const apiDichVuUrl = 'http://192.168.1.2:3000/api/dichvu';


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


async function renderDichVu() {
    const dichVuList = await fetchAllDichVu();
    const dichVuTable = document.getElementById('dichvu-list');
    dichVuTable.innerHTML = ''; // Xóa nội dung cũ

    dichVuList.forEach(dv => {
        const row = document.createElement('tr');
        row.setAttribute('data-id', dv._id);
        row.onclick = () => showDichVuDetails(dv);

        row.innerHTML = `
            <td class="hidden">${dv._id}</td>
            <td>${dv.tenDichVu}</td>
            <td>${dv.giaDichVu}</td>
            <td>${dv.motaDichVu}</td>
            <td><img src="${dv.anhDichVu}" alt="${dv.tenDichVu}" width="50"></td>
        `;
        dichVuTable.appendChild(row);
    });
}


async function showDichVuDetails(dv) {
    const { _id, tenDichVu, giaDichVu, motaDichVu, anhDichVu } = dv;

    document.getElementById('maDichVu').value = _id;
    document.getElementById('tenDichVu').value = tenDichVu || '';
    document.getElementById('giaDichVu').value = giaDichVu || '0';
    document.getElementById('motaDichVu').value = motaDichVu || '';
    document.getElementById('anhDichVu').value = anhDichVu || '';
}


async function addDichVu() {
    const tenDichVu = document.getElementById('tenDichVu').value.trim();
    const giaDichVuValue = parseFloat(document.getElementById('giaDichVu').value.trim());
    const motaDichVu = document.getElementById('motaDichVu').value.trim();
    const anhDichVu = document.getElementById('anhDichVu').value.trim();

    // Validate
    if (!tenDichVu) {
        alert('Tên dịch vụ không được để trống');
        return;
    }
    if (isNaN(giaDichVuValue) || giaDichVuValue < 0 || giaDichVuValue >= 1000000000) {
        alert('Giá dịch vụ phải là số dương nhỏ hơn 1 tỷ');
        return;
    }
    if (motaDichVu.length > 1000) {
        alert('Mô tả dịch vụ không được vượt quá 1000 ký tự');
        return;
    }
    if (anhDichVu && !/^https?:\/\/[^\s$.?#].[^\s]*$/.test(anhDichVu)) {
        alert('URL ảnh dịch vụ không hợp lệ');
        return;
    }
    const dichVuList = await fetchAllDichVu();
    const isDuplicate = dichVuList.some(dv => dv.tenDichVu.toLowerCase() === tenDichVu.toLowerCase());

    if (isDuplicate) {
        alert('Tên dịch vụ đã tồn tại, vui lòng chọn tên khác');
        return;
    }

    const newDichVu = { tenDichVu, giaDichVu: giaDichVuValue, motaDichVu, anhDichVu };

    try {
        const response = await fetch(apiDichVuUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newDichVu),
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


async function editDichVu() {
    const maDichVu = document.getElementById('maDichVu').value.trim();
    if (!maDichVu) {
        alert('Vui lòng chọn dịch vụ để sửa!');
        return;
    }

    const giaDichVuValue = parseFloat(document.getElementById('giaDichVu').value.trim());
    if (isNaN(giaDichVuValue) || giaDichVuValue < 0) {
        alert('Giá dịch vụ sai định dạng');
        return;
    }
    if (isNaN(giaDichVuValue) || giaDichVuValue >= 1000000000) {
        alert('Giá dịch vụ quá lớn');
        return;
    }

    const updatedDichVu = {
        tenDichVu: document.getElementById('tenDichVu').value.trim(),
        giaDichVu: giaDichVuValue,
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




function clearForm() {
    document.getElementById('dichvu-form').reset();
    document.getElementById('maDichVu').value = '';
}


document.addEventListener('DOMContentLoaded', renderDichVu);
function confirmLogout(event) {
    event.preventDefault();
    const userConfirmed = confirm("Bạn có chắc chắn muốn đăng xuất?");

    if (userConfirmed) {
        window.location.href = "../../welcome.html";
    }
}