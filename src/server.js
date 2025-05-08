import express from 'express';
import crypto from 'node:crypto';

const app = express();
const port = 3000;

const TICKET_RATE_PER_HOUR = 10;
const PRORATE_INTERVAL_MINUTES = 15;
const tickets = new Map();  // In-memory storage. Use DB in prod.

function generateTicketId() {
  return crypto.randomUUID();
}

function calculateFee(entryTime, exitTime) {
  const minutes = (exitTime - entryTime) / 60000;
  const intervals = Math.ceil(minutes / PRORATE_INTERVAL_MINUTES);
  return (intervals * (TICKET_RATE_PER_HOUR / (60 / PRORATE_INTERVAL_MINUTES))).toFixed(2);
}
app.get('/', (req, res) => {
    res.send('Welcome to the Parking Ticket System!');
  });
  
app.post('/entry', (req, res) => {
  const plate = req.query.plate;
  const parkingLot = req.query.parkingLot;

  if (!plate || !parkingLot) {
    return res.status(400).json({ error: 'Missing plate or parkingLot' });
  }

  const ticketId = generateTicketId();
  const entryTime = new Date();

  tickets.set(ticketId, { plate, parkingLot, entryTime });

  res.json({ ticketId });
});

app.post('/exit', (req, res) => {
  const ticketId = req.query.ticketId;

  const ticket = tickets.get(ticketId);
  if (!ticket) {
    return res.status(404).json({ error: 'Ticket not found' });
  }

  const exitTime = new Date();
  const fee = calculateFee(ticket.entryTime, exitTime);
  const duration = ((exitTime - ticket.entryTime) / 60000).toFixed(2);

  tickets.delete(ticketId);

  res.json({
    plate: ticket.plate,
    parkingLot: ticket.parkingLot,
    durationMinutes: duration,
    fee: `$${fee}`
  });
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});