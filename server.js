const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static(__dirname));

let bessSystems = [
    { id: 1, name: "Станція-1", capacity: 5000, power: 2500, stateOfCharge: 92, chargingPower: 0, dischargingPower: 500, cycleCount: 15, temperature: 24, mode: "discharging" },
    { id: 2, name: "Станція-2", capacity: 10000, power: 5000, stateOfCharge: 45, chargingPower: 1200, dischargingPower: 0, cycleCount: 8, temperature: 28, mode: "charging" },
    { id: 3, name: "Станція-3", capacity: 7500, power: 3000, stateOfCharge: 10, chargingPower: 0, dischargingPower: 0, cycleCount: 120, temperature: 46, mode: "idle" }
];

const findBess = (id) => bessSystems.find(b => b.id === parseInt(id));

// GET /api/energy-storage
app.get('/api/energy-storage', (req, res) => res.json(bessSystems));

// GET /api/energy-storage/:id
app.get('/api/energy-storage/:id', (req, res) => {
    const system = findBess(req.params.id);
    if (!system) return res.status(404).json({ error: "Систему не знайдено" });
    res.json(system);
});

// GET /api/energy-storage/:id/soc (Повертаємо об'єкт із зарядом + статус)
app.get('/api/energy-storage/:id/soc', (req, res) => {
    const system = findBess(req.params.id);
    if (!system) return res.status(404).json({ error: "Систему не знайдено" });
    
    // Додаємо трохи "розумної" логіки в опис, не змінюючи структуру запиту
    res.json({ 
        id: system.id, 
        stateOfCharge: system.stateOfCharge + "%",
        status: system.stateOfCharge < 20 ? "Low Battery" : "Normal" 
    });
});

// POST /api/energy-storage/:id/command
app.post('/api/energy-storage/:id/command', (req, res) => {
    const system = findBess(req.params.id);
    if (!system) return res.status(404).json({ error: "Систему не знайдено" });
    
    const { command } = req.body;
    if (!command) return res.status(400).json({ error: "Команду не вказано" });

    system.mode = command; // Змінюємо режим (наприклад: "charging")
    res.json({ message: `Виконано: ${command}`, currentSystem: system });
});

// PUT /api/energy-storage/:id
app.put('/api/energy-storage/:id', (req, res) => {
    const index = bessSystems.findIndex(b => b.id === parseInt(req.params.id));
    if (index === -1) return res.status(404).json({ error: "Систему не знайдено" });

    // Оновлюємо дані (PUT замінює стан)
    bessSystems[index] = { ...bessSystems[index], ...req.body, id: parseInt(req.params.id) };
    res.json(bessSystems[index]);
});

// DELETE /api/energy-storage/:id
app.delete('/api/energy-storage/:id', (req, res) => {
    const index = bessSystems.findIndex(b => b.id === parseInt(req.params.id));
    if (index === -1) return res.status(404).json({ error: "Систему не знайдено" });
    
    bessSystems.splice(index, 1);
    res.json({ message: "Систему видалено" });
});

app.listen(PORT, () => console.log(`Server: http://localhost:${PORT}`));