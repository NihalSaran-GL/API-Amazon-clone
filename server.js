// JSON Server module
const jsonServer = require("json-server");
const fs = require("fs");
const server = jsonServer.create();
const router = jsonServer.router("db/db.json");
const middlewares = jsonServer.defaults();

server.use(middlewares);
// Add this before server.use(router)
server.use(
    // Add custom route here if needed
    jsonServer.rewriter({
        "/api/*": "/$1",
    })
);

// Middleware to handle write operations
server.use(jsonServer.bodyParser);

// Custom route for write operation
server.post("/api/write", (req, res) => {
    // Extract data from request body
    const newData = req.body;
    // Read current data from JSON file
    const currentData = JSON.parse(fs.readFileSync("db/db.json"));
    // Merge current data with new data
    const mergedData = { ...currentData, ...newData };
    // Write merged data back to JSON file
    fs.writeFileSync("db/db.json", JSON.stringify(mergedData, null, 2));
    // Send response
    res.json({ message: "Data written successfully" });
});

// Use router for other operations
server.use(router);

server.listen(3000, () => {
    console.log("JSON Server is running");
});

// Export the Server API
module.exports = server;
