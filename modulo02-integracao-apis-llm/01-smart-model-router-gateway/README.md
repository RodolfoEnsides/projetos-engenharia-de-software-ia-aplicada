# Smart Model Router Gateway

Este projeto demonstra o conceito de um gateway inteligente para chamadas a LLMs. Em vez de a aplicacao cliente escolher diretamente um modelo especifico, ela envia a pergunta para uma API propria, e essa API delega ao OpenRouter a selecao do melhor modelo dentro de uma lista configurada.

Na pratica, o projeto funciona como uma camada intermediaria entre o consumidor da aplicacao e os provedores de modelos de linguagem.

## Conceito Base

Quando uma aplicacao usa LLMs em producao, nem sempre faz sentido ficar presa a um unico modelo. Modelos diferentes podem ter custos, limites, latencia, qualidade e disponibilidade diferentes.

Um roteador de modelos resolve esse problema centralizando a decisao de qual modelo usar em uma camada de gateway.

Neste projeto, essa decisao e feita a partir de uma lista de modelos configurada em `src/config.ts`:

```ts
models: ["liquid/lfm-2.5-2.6b:free", "nvidia/nemotron-3.5-lightning:free"]
```

O OpenRouter recebe essa lista e pode escolher o modelo de acordo com a estrategia definida em `provider.sort`, por exemplo:

```ts
provider: {
  sort: {
    by: "price",
    partition: "none",
  },
}
```

Com isso, a aplicacao pode priorizar criterios como menor preco ou maior throughput sem mudar o codigo do cliente que consome a API.

## Fluxo da Aplicacao

1. O usuario envia uma pergunta para o endpoint `POST /chat`.
2. O servidor Fastify valida se o corpo da requisicao contem uma `question`.
3. O `OpenRouterService` monta uma chamada de chat com:
   - prompt de sistema;
   - pergunta do usuario;
   - lista de modelos disponiveis;
   - temperatura;
   - limite de tokens;
   - estrategia de roteamento do provider.
4. O OpenRouter escolhe um modelo entre os modelos configurados.
5. A API retorna o conteudo gerado e o nome do modelo usado.

Exemplo de resposta:

```json
{
  "model": "liquid/lfm-2.5-2.6b:free",
  "content": "..."
}
```

## Estrutura Principal

- `src/index.ts`: ponto de entrada da aplicacao. Cria o servico, cria o servidor e sobe a API na porta `3000`.
- `src/server.ts`: define o servidor Fastify e o endpoint `POST /chat`.
- `src/openrouterService.ts`: encapsula a integracao com o SDK do OpenRouter.
- `src/config.ts`: centraliza chave de API, modelos, parametros de geracao e estrategia de roteamento.
- `tests/router.e2e.test.ts`: exemplos de testes e2e para validar diferentes estrategias de roteamento.

## Configuracao

Crie um arquivo `.env` na raiz do projeto com a sua chave do OpenRouter:

```env
OPENROUTER_API_KEY=your_openrouter_api_key_here
```

O arquivo `.env.exemple` serve como referencia.

## Como Rodar

Instale as dependencias:

```bash
npm install
```

Execute o servidor em modo desenvolvimento:

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
  -d '{"question":"What is the capital of Minas Gerais?"}'
```

## Ideia Arquitetural

O ganho principal deste projeto nao esta apenas em chamar uma LLM, mas em separar responsabilidades:

- o cliente so conhece a API `/chat`;
- a API conhece as regras de roteamento;
- o OpenRouter executa a chamada no modelo escolhido;
- a configuracao define quais modelos podem ser usados e qual criterio deve ser priorizado.

Esse desenho facilita trocar modelos, testar estrategias de custo e desempenho, adicionar fallback e evoluir a aplicacao sem acoplar o consumidor final a um provedor especifico.
