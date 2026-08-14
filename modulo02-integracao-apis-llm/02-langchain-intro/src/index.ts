import { createServer } from "./server.ts";

const app = createServer();

await app.listen({ port: 3000, host: "0.0.0.0" });
console.log(`Server listening on http://localhost:3000`);

//curl -X POST http://localhost:3000/chat -H "Content-Type: application/json" -d '{"question": "Faça essa mensagem ficar em uppercase"}'
