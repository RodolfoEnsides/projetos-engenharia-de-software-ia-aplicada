import test from "node:test";
import assert from "node:assert";
import { createServer } from "../src/server.ts";

test.todo("command upper transforms message into UPPERCASE", async () => {
  const app = createServer();
  const msg = "Faça essa mensagem ficar em uppercase";
  const expectedResponse = msg.toUpperCase();

  const response = await app.inject({
    method: "POST",
    url: "/chat",
    body: { question: msg },
  });

  assert.equal(response.statusCode, 200);
  assert.equal(response.body, expectedResponse);
});

test.todo("command lower transforms message into LOWERCASE", async () => {
  const app = createServer();
  const msg = "FAÇA ESSA MENSAGEM FICAR EM LOWERCASE";
  const expectedResponse = msg.toLowerCase();

  const response = await app.inject({
    method: "POST",
    url: "/chat",
    body: { question: msg },
  });

  assert.equal(response.statusCode, 200);
  assert.equal(response.body, expectedResponse);
});

test.todo("command unknown returns default response", async () => {
  const app = createServer();
  const msg = "Quero que essa mensagem fique em negrito, por favor";
  const expectedResponse =
    "Desculpe, não entendi o que você quis dizer. Consigo apenas transformar mensagens em UPPERCASE ou lowercase.";

  const response = await app.inject({
    method: "POST",
    url: "/chat",
    body: { question: msg },
  });

  assert.equal(response.statusCode, 200);
  assert.equal(response.body, expectedResponse);
});
