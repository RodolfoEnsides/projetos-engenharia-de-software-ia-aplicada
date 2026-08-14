# LangChain Intro com LangGraph

Este projeto apresenta o conceito base de construcao de fluxos com LangGraph dentro de uma API Node.js. A ideia principal e organizar uma tarefa em etapas pequenas chamadas de nos, conectadas por arestas que definem o caminho que a execucao deve seguir.

Neste exemplo, a API recebe uma mensagem e decide se deve transformar o texto em uppercase, transformar em lowercase ou retornar uma resposta padrao quando nao entende o comando.

## Conceito Base

O LangGraph permite modelar uma aplicacao de IA como um grafo de execucao. Em vez de escrever toda a logica em uma unica funcao, o fluxo e dividido em partes:

- estado: os dados compartilhados entre os nos;
- nos: funcoes que leem e atualizam o estado;
- arestas: conexoes entre os nos;
- arestas condicionais: decisoes que escolhem o proximo no com base no estado.

Neste projeto, o estado do grafo e definido em `src/graph/graph.ts`:

```ts
const GraphState = z.object({
  messages: withLangGraph(z.custom<BaseMessage[]>(), MessagesZodMeta),
  output: z.string(),
  command: z.enum(["uppercase", "lowercase", "unknown"]),
});
```

Esse estado guarda:

- `messages`: historico de mensagens no formato do LangChain;
- `output`: texto que sera devolvido pela API;
- `command`: intencao identificada na mensagem do usuario.

## Fluxo do Grafo

O grafo comeca em `START` e passa pelo no `identifyIntent`, que identifica a intencao do usuario.

Depois disso, uma aresta condicional escolhe o proximo caminho:

- `uppercase`: envia para o no que transforma o texto em letras maiusculas;
- `lowercase`: envia para o no que transforma o texto em letras minusculas;
- `fallback`: envia para uma resposta padrao quando o comando nao e reconhecido.

No final, todos os caminhos passam pelo no `chatResponse`, que adiciona uma `AIMessage` ao historico e encerra o fluxo em `END`.

Fluxo resumido:

```txt
START
  -> identifyIntent
    -> uppercase -> chatResponse -> END
    -> lowercase -> chatResponse -> END
    -> fallback  -> chatResponse -> END
```

## Nos do Grafo

- `identifyItentNode.ts`: le a ultima mensagem do usuario e define o comando como `uppercase`, `lowercase` ou `unknown`.
- `upperCaseNode.ts`: transforma o texto armazenado em `output` para letras maiusculas.
- `lowerCaseNode.ts`: transforma o texto armazenado em `output` para letras minusculas.
- `fallbackNode.ts`: define uma mensagem padrao quando a intencao nao e reconhecida.
- `chatResponseNode.ts`: adiciona a resposta final ao historico de mensagens.

## API HTTP

O projeto usa Fastify para expor o grafo como uma API HTTP.

O endpoint principal e:

```txt
POST /chat
```

Ele espera um corpo JSON com a propriedade `question`:

```json
{
  "question": "Faça essa mensagem ficar em uppercase"
}
```

O servidor converte essa pergunta em uma `HumanMessage` e chama o grafo:

```ts
const response = await graph.invoke({
  messages: [new HumanMessage(question)],
});
```

A resposta enviada para o cliente e o valor final de `response.output`.

## LangGraph Studio

O arquivo `langgraph.json` permite rodar o grafo no ambiente de desenvolvimento do LangGraph:

```json
{
  "graphs": {
    "agent": "./src/graph/factory.ts:graph"
  }
}
```

O arquivo `src/graph/factory.ts` exporta uma funcao `graph`, usada pelo LangGraph CLI para carregar o grafo.

## Como Rodar

Instale as dependencias:

```bash
npm install
```

Execute a API local:

```bash
npm run dev
```

O servidor ficara disponivel em:

```txt
http://localhost:3000
```

Exemplo de chamada:

```bash
curl -X POST http://localhost:3000/chat \
  -H "Content-Type: application/json" \
  -d '{"question": "Faça essa mensagem ficar em uppercase"}'
```

Para rodar o servidor de desenvolvimento do LangGraph:

```bash
npm run langgraph:serve
```

## Testes

Execute os testes com:

```bash
npm test
```

Os testes validam os tres caminhos principais do grafo:

- transformar uma mensagem em uppercase;
- transformar uma mensagem em lowercase;
- retornar fallback quando a intencao e desconhecida.

## Ideia Arquitetural

O ganho principal deste projeto e mostrar como separar uma aplicacao em etapas declarativas. Mesmo em um exemplo simples, o grafo deixa claro onde cada responsabilidade vive:

- a API recebe a requisicao;
- o grafo controla o fluxo;
- cada no executa uma pequena transformacao;
- as arestas condicionais decidem o caminho da execucao.

Esse padrao e a base para construir fluxos mais complexos com LLMs, ferramentas, memoria, validacoes, agentes e decisoes condicionais.
