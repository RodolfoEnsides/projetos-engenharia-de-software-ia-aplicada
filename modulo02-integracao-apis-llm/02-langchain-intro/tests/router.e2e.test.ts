import test from "node:test";
import assert from "node:assert";
import { createServer } from "../src/server.ts";

test.todo("command upper transforms message into UPPERCASE", async () => {
  const app = createServer();
  const msg = "Make this sentence in uppercase: ai ai ai caramba";
  const expectedResponse = msg.toUpperCase();

  const response = await app.inject({
    method: "POST",
    url: "/chat",
    body: { question: msg },
  });

  assert.equal(response.statusCode, 200);
  assert.equal(response.body, expectedResponse);
});
