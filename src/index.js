///this file is a local code for testing
import crypto from 'node:crypto';

const TICKET_RATE_PER_HOUR = 10;
const PRORATE_INTERVAL_MINUTES = 15;

function generateTicketId() {
  return crypto.randomUUID();
}

function calculateFee(entryTime, exitTime) {
  const durationMs = exitTime - entryTime;
  const minutes = durationMs / (1000 * 60);
  const intervals = Math.ceil(minutes / PRORATE_INTERVAL_MINUTES);
  return (intervals * (TICKET_RATE_PER_HOUR / (60 / PRORATE_INTERVAL_MINUTES))).toFixed(2);
}

// Example usage:
const plateNumber = 'ABC1234';
const parkingLotId = 'Lot-42';
const entryTime = new Date();

console.log(`Vehicle ${plateNumber} entered at ${entryTime.toISOString()}`);
const ticketId = generateTicketId();

// simulate exit after 1 hour 20 minutes
const exitTime = new Date(entryTime.getTime() + 80 * 60 * 1000);
const fee = calculateFee(entryTime, exitTime);

console.log(`Ticket ID: ${ticketId}`);
console.log(`Duration: ${(exitTime - entryTime) / (1000 * 60)} minutes`);
console.log(`Fee: $${fee}`);