// Required gRPC module and proto loader
const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");

// Defining the path to the proto file in the server folder
const PROTO_PATH = __dirname + "/../protos/incident_service.proto";

// Loading the proto file with configuration
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

const incidentProto = grpc.loadPackageDefinition(packageDefinition).incident;

// Mock data with x3 incidents that will be passed afert X seconds
let incidents = [
  {
    date: new Date().toLocaleDateString(),
    time: "08:00",
    motorwaySection: "M50-Northbound",
    description: "🚗🔧 Vehicle breakdown at Junction 5",
  },
  {
    date: new Date().toLocaleDateString(),
    time: "08:15",
    motorwaySection: "M50-Southbound",
    description: "⚠️ Traffic congestion near Junction 6",
  },
  {
    date: new Date().toLocaleDateString(),
    time: "08:30",
    motorwaySection: "M50-Eastbound",
    description: "💥🚗 Accident at Junction 7 - Emergency services on site",
  },
];

// Implementing GetCurrentIncident
const getCurrentIncident = (call) => {
  let currentIndex = 0; // Initialize an index to keep track of which incident to be send to the client

  const sendDataInterval = setInterval(() => {
    if (currentIndex < incidents.length) {
      console.log("Sending SSE data:", incidents[currentIndex]);
      call.write({
        date: incidents[currentIndex].date,
        time: incidents[currentIndex].time,
        motorwaySection: incidents[currentIndex].motorwaySection,
        description: incidents[currentIndex].description,
      });
      currentIndex++;
    } else {
      // No more incidents to send, stop the interval and send a "No Incident Detected" message
      clearInterval(sendDataInterval);
      console.log("No Incident Detected");
      call.end();
    }
  }, 10000); // Send data every 10 seconds

  // Handle client's end event. If client ends connection, clear interval to stop sending data.
  call.on("end", () => {
    clearInterval(sendDataInterval);
  });
};

// Creating the gRPC server
const server = new grpc.Server();
server.addService(incidentProto.IncidentAlertService.service, {
  GetCurrentIncident: getCurrentIncident,
});

// Binding and starting the server
server.bindAsync(
  "0.0.0.0:40001",
  grpc.ServerCredentials.createInsecure(),
  () => {
    server.start();
    console.log("Incident Alert Service running on port 40001");
  }
);
