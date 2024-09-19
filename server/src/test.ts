// import io from "socket.io-client";

// const socket = io("http://your-server-url");

// socket.on("connect", () => {
//   console.log("Connected to server");

//   // Subscribe to a log
//   socket.emit("subscribe_log", { jobName: "MyJob", buildNumber: 123 });
// });

// socket.on("log_update", (data) => {
//   console.log(`Log update for ${data.jobName} #${data.buildNumber}:`, data.log);
//   // Update your UI with the new log data
// });

// socket.on("log_end", (data) => {
//   console.log(`Log stream ended for ${data.jobName} #${data.buildNumber}`);
//   // Update your UI to indicate the log stream has ended
// });

// socket.on("log_error", (data) => {
//   console.error(`Error in log stream for ${data.jobName} #${data.buildNumber}:`, data.error);
//   // Handle the error in your UI
// });

// // When you want to stop receiving logs
// socket.emit("unsubscribe_log");
