import * as aws from "@pulumi/aws";
import * as pulumi from "@pulumi/pulumi";

// Replace with your GitHub repo
const GITHUB_REPO = "https://github.com/Dov-Farber/parkingTicket.git";

// Get latest Amazon Linux AMI
const ami = aws.ec2.getAmi({
    mostRecent: true,
    owners: ["amazon"],
    filters: [
        { name: "name", values: ["amzn2-ami-hvm-*-x86_64-gp2"] },
        { name: "virtualization-type", values: ["hvm"] }
    ]
});

// Security Group - open port 22 (SSH) and 3000 (your app)
const secGroup = new aws.ec2.SecurityGroup("parking-sg", {
    description: "Allow SSH and app traffic",
    ingress: [
        { protocol: "tcp", fromPort: 22, toPort: 22, cidrBlocks: ["0.0.0.0/0"] },
        { protocol: "tcp", fromPort: 3000, toPort: 3000, cidrBlocks: ["0.0.0.0/0"] }
    ],
    egress: [
        { protocol: "-1", fromPort: 0, toPort: 0, cidrBlocks: ["0.0.0.0/0"] }
    ]
});

// User data script (runs on instance startup)
const userData = `#!/bin/bash
yum update -y
curl -sL https://rpm.nodesource.com/setup_18.x | bash -
yum install -y nodejs git

cd /home/ec2-user
git clone ${GITHUB_REPO}
cd parkingTicket

npm install
chmod +x src/start.sh
./src/start.sh
`;

const server = new aws.ec2.Instance("parking-ticket-server", {
    ami: ami.then(a => a.id),
    instanceType: "t2.micro",
    securityGroups: [secGroup.name],
    userData: userData,
    tags: { Name: "ParkingTicketApp" }
});

export const publicIp = server.publicIp;
export const publicDns = server.publicDns;