// Оновлення блоку "Поточні дані" (загальний стан системи)
async function updateDbView() {
    try {
        const response = await fetch('/api/energy-storage');
        const data = await response.json();
        document.getElementById('current-data').textContent = JSON.stringify(data, null, 2);
        document.getElementById('total-count').textContent = data.length;
    } catch (err) {
        console.error("Помилка оновлення БД:", err);
    }
}

// Універсальна функція для виклику API (GET, POST, PUT, DELETE)
async function apiCall(method, url, bodyData = null) {
    const statusEl = document.getElementById('response-status');
    const bodyEl = document.getElementById('response-body');

    statusEl.textContent = "Завантаження...";
    statusEl.className = 'status-neutral';
    bodyEl.textContent = "{ ... }";

    const options = { method };
    if (bodyData) {
        options.headers = { 'Content-Type': 'application/json' };
        options.body = JSON.stringify(bodyData);
    }

    try {
        const response = await fetch(url, options);
        const data = await response.json();

        statusEl.textContent = `${response.status} ${response.statusText || ""}`;
        statusEl.className = response.ok ? 'status-success' : 'status-error';
        bodyEl.textContent = JSON.stringify(data, null, 2);
        
        if (method !== 'GET') updateDbView();
    } catch (error) {
        statusEl.textContent = "Помилка";
        statusEl.className = 'status-error';
        bodyEl.textContent = JSON.stringify({ error: error.message }, null, 2);
    }
}

// ФУНКЦІЇ ДЛЯ ДИНАМІЧНОГО ID

// Допоміжна функція для отримання ID з поля вводу
function getSelectedId() {
    return document.getElementById('system-id').value;
}

// GET: Отримати за ID
async function getById() {
    apiCall('GET', `/api/energy-storage/${getSelectedId()}`);
}

// GET: Отримати тільки рівень заряду (SOC)
async function getSocById() {
    apiCall('GET', `/api/energy-storage/${getSelectedId()}/soc`);
}

// POST: Відправка команд управління
async function sendCommandById(commandValue) {
    apiCall('POST', `/api/energy-storage/${getSelectedId()}/command`, { command: commandValue });
}

// PUT: Оновлення параметрів
async function updateById() {
    const updatedData = {
        name: "Оновлена Станція",
        temperature: 25
    };
    apiCall('PUT', `/api/energy-storage/${getSelectedId()}`, updatedData);
}

// DELETE: Видалення системи
async function deleteById() {
    apiCall('DELETE', `/api/energy-storage/${getSelectedId()}`);
}

// Ініціалізація даних при завантаженні сторінки
updateDbView();