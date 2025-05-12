# Parking Ticket System

This project is a Parking Ticket System that allows users to manage parking entries and exits. Below are the instructions to set up the infrastructure, run and test the application, and clean up the infrastructure when finished.

---

## 1. Setting Up the Infrastructure

### Prerequisites
- Install [Pulumi](https://www.pulumi.com/docs/get-started/install/).
- Install Node.js (version 14 or higher).
- Configure AWS credentials using `aws configure` or environment variables (`AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY`).

### Steps
1. Navigate to the `parking-iac` directory:
   ```bash
   cd parking-iac
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Initialize Pulumi (if not already initialized):
   ```bash
   pulumi stack init dev
   ```
4. Deploy the infrastructure:
   ```bash
   pulumi up
   ```
   - Review the changes and confirm the deployment.
   - Note the `publicIp` or `publicDns` output, which will be used to test the application.

---

## 2. Running the Application

The application will automatically start on the EC2 instance after the infrastructure is deployed. It listens on port `3000`.

To verify the application is running, open a browser and navigate to:
```
http://<public-ip>:3000/
```
You should see the message: **"Welcome to the Parking Ticket System!"**

---

## 3. Testing the Application

### A. Test the `/entry` Route
Send a POST request to the `/entry` endpoint with the required query parameters (`plate` and `parkingLot`):

#### Using cURL:
```bash
curl -X POST "http://<public-ip>:3000/entry?plate=ABC1234&parkingLot=Lot-42"
```

#### Expected Response:
```json
{
  "ticketId": "some-unique-ticket-id"
}
```

### B. Test the `/exit` Route
Use the `ticketId` from the `/entry` response to test the `/exit` endpoint:

#### Using cURL:
```bash
curl -X POST "http://<public-ip>:3000/exit?ticketId=some-unique-ticket-id"
```

#### Expected Response:
```json
{
  "plate": "ABC1234",
  "parkingLot": "Lot-42",
  "durationMinutes": "80.00",
  "fee": "$13.33"
}
```

---

## 4. Cleaning Up the Infrastructure

When you are finished, destroy the infrastructure to avoid unnecessary costs:

1. Navigate to the `parking-iac` directory:
   ```bash
   cd parking-iac
   ```
2. Destroy the infrastructure:
   ```bash
   pulumi destroy
   ```
   - Review the changes and confirm the destruction.

---

## Notes
- Ensure your security group allows inbound traffic on port `3000`.
- Use Pulumi secrets to manage sensitive data securely.

For any issues, check the logs on the EC2 instance or contact the project maintainer.