import app from "./app";
import { PORT } from "./utils/config";

app.listen(PORT, function () {
	console.log(`⚡️[server]: Server started on port ${PORT}`);
});

export {};
