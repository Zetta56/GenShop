const app = require("./app")
const http = require("http").createServer(app);

http.listen(process.env.PORT || 3001, () => {
	console.log("Server Started");
});