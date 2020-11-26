// import React, {useState, useEffect} from "react";
// import socketIO from "socket.io-client";

// const SocketIO = () => {
// 	const [response, setResponse] = useState("");
// 	const socket = socketIO(process.env.REACT_APP_BACKEND_URL);

// 	useEffect(() => {
// 		const socket = socketIO(process.env.REACT_APP_BACKEND_URL);
// 		socket.on("message", data => {
// 			setResponse(data);
// 		})

// 		return () => socket.disconnect();
// 	}, []);

// 	return (
// 		<div>
// 			{response}
// 			<input onChange={(e) => socket.emit("message", e.target.value)} />
// 		</div>
// 	);
// };

// export default SocketIO;