# Recomendador Musical com Memória usando LangGraph

Template didático de um assistente conversacional que **recomenda músicas e mantém as preferências do usuário entre interações**. O projeto demonstra como combinar LangGraph, respostas estruturadas de um LLM, memória de conversa e persistência de preferências.

> **Estado do projeto:** o estado do grafo, o roteamento, os prompts, o cliente do OpenRouter, o serviço SQLite e a interface de terminal já estão definidos. Os nós do grafo e a integração da memória ainda são placeholders. Portanto, este diretório é um exercício a ser completado, não uma aplicação funcional.

## Objetivo

O assistente deve conduzir conversas como:

```text
Usuário: Meu nome é Alex e eu gosto de rock e metal.
Assistente: Prazer, Alex! Com base no seu gosto, experimente "Master of Puppets", do Metallica. Quais bandas você mais ouve?

Usuário: Gosto especialmente de Foo Fighters e Iron Maiden.
Assistente: Ótimas escolhas! Recomendo "The Pretender", do Foo Fighters, e "Hallowed Be Thy Name", do Iron Maiden.
```

A cada interação, o fluxo deverá:

1. gerar uma resposta em português com recomendações específicas;
2. extrair apenas preferências declaradas pelo usuário;
3. decidir se existem novas informações que precisam ser salvas;
4. persistir nome, idade, gêneros, artistas e contexto de escuta;
5. resumir conversas longas quando necessário;
6. recuperar as preferências nas próximas sessões do mesmo usuário.

## Fluxo do LangGraph

```text
START -> chat
           |-> savePreferences -> summarize -> END
           |-> savePreferences -------------> END
           |-> summarize --------------------> END
           `---------------------------------> END
```

O estado compartilhado pelo grafo contém:

- histórico de mensagens;
- contexto previamente conhecido sobre o usuário;
- preferências extraídas da mensagem atual;
- indicador de necessidade de sumarização;
- resumo da conversa;
- identificador do usuário.

### Responsabilidade dos nós

- `chat`: deve montar os prompts, chamar o OpenRouter com `ChatResponseSchema`, adicionar a resposta da IA ao histórico e atualizar as preferências extraídas.
- `savePreferences`: deve salvar as novas informações do usuário por meio do `PreferencesService`.
- `summarize`: deve gerar um resumo estruturado com `SummarySchema` e persistir o resultado.
- `routeAfterChat` e `routeAfterSavePreferences`: encaminham o estado conforme existam preferências para salvar ou necessidade de sumarização.

## Componentes

```text
src/
  index.ts                         # Interface de chat no terminal
  config.ts                        # Configuração do OpenRouter e URI planejada da memória
  graph/
    graph.ts                       # Estado, nós e arestas do LangGraph
    factory.ts                     # Criação do cliente e exportação do grafo
    nodes/
      chatNode.ts                  # Resposta e extração de preferências (pendente)
      savePreferencesNode.ts       # Persistência das preferências (pendente)
      summarizationNode.ts         # Sumarização da conversa (pendente)
      edgeConditions.ts            # Regras de roteamento
  prompts/v1/
    chatResponse.ts                # Prompts e schemas da resposta do chat
    summarization.ts               # Prompts e schema do resumo
  services/
    openrouterService.ts           # Cliente de LLM com saída estruturada
    preferencesService.ts          # Persistência de preferências em SQLite
tests/
  chat.e2e.test.ts                 # Cenários E2E esperados para memória e chat
```

Também existem:

- `docker-compose.yml`, com PostgreSQL para a estratégia planejada de checkpointer;
- `langgraph.json`, que publica o grafo como `song_highlights` no LangGraph Studio;
- `.env.example`, com as variáveis do OpenRouter e do LangSmith.

## O que já está implementado

- estado do LangGraph definido com Zod;
- nós e arestas condicionais registrados no grafo;
- prompts em português para chat e sumarização;
- schemas estruturados para resposta, preferências e resumo;
- cliente do OpenRouter baseado em `ChatOpenAI` e `providerStrategy`;
- serviço SQLite capaz de criar e atualizar a tabela `user_preferences`;
- interface interativa de terminal com identificação por usuário;
- configuração para LangGraph Studio;
- cenários E2E que especificam o comportamento esperado.

## O que falta implementar

- implementar a chamada ao LLM no `chatNode`;
- adicionar a resposta da IA ao estado;
- definir o critério que ativa `needsSummarization`;
- conectar o `PreferencesService` ao `savePreferencesNode`;
- implementar a geração e a persistência do resumo;
- configurar um checkpointer no `graph.compile(...)` para manter o histórico por `thread_id`;
- substituir o `memoryService` simulado da factory por uma implementação real;
- carregar as preferências persistidas ao iniciar uma nova sessão;
- escolher e conectar uma única estratégia de persistência: SQLite para preferências e, se desejado, PostgreSQL para checkpoints;
- revisar as dependências diretas do `package.json`, incluindo os pacotes importados pelo código;
- fazer os testes E2E passarem.

No estado atual, `memoryService.store.search(...)` sempre retorna uma lista vazia. Além disso, os três nós devolvem o estado sem executar nenhuma operação. Por isso, o chat não produz uma `AIMessage`, não salva preferências e não mantém o histórico entre chamadas.

## Pré-requisitos

- Node.js `>= 24.10.0`;
- npm;
- chave do OpenRouter;
- Docker, apenas se a persistência com PostgreSQL for implementada;
- chave do LangSmith, apenas se o tracing for utilizado.

## Configuração

Instale as dependências:

```bash
npm install
```

Crie o arquivo de ambiente:

```bash
cp .env.example .env
```

Preencha as variáveis necessárias:

```env
OPENROUTER_API_KEY=your_openrouter_api_key_here
OPENROUTER_HTTP_REFERER=http://localhost:3000
OPENROUTER_X_TITLE=Song-Recommender

# Opcionais: observabilidade com LangSmith
LANGSMITH_API_KEY=your_langsmith_api_key_here
LANGCHAIN_TRACING_V2=true
LANGCHAIN_PROJECT=04-song-highlights
```

Apenas configurar as chaves não completa o projeto: os nós e os mecanismos de memória ainda precisam ser implementados.

## Executando após a implementação

Os scripts existentes iniciam o chat com usuários fixos. O mesmo identificador deve recuperar as preferências daquele usuário:

```bash
npm run chat:rodolfo
npm run chat:ana
```

Durante a conversa, digite `exit` para encerrar.

Para iniciar o PostgreSQL previsto no projeto:

```bash
npm run docker:up
```

Para encerrá-lo:

```bash
npm run docker:down
```

O banco usa a porta `5432` e a URI definida atualmente em `src/config.ts`. Essa infraestrutura ainda não está conectada ao grafo.

## LangGraph Studio

Após completar as dependências e a factory, inicie o ambiente de desenvolvimento:

```bash
npm run langgraph:serve
```

O grafo é publicado com o nome `song_highlights`.

## Testes

Execute os testes E2E:

```bash
npm test
```

Durante o desenvolvimento:

```bash
npm run test:watch
```

Os testes descrevem cinco comportamentos esperados:

- extrair e salvar preferências;
- acumular informações ao longo de várias mensagens;
- recuperar contexto em uma nova sessão;
- responder sem salvar dados quando não há novas preferências;
- manter o histórico da conversa por `thread_id`.

Esses testes dependem de chamadas reais ao modelo e, no template atual, falham porque a memória e os nós ainda não foram implementados.

## Conceitos praticados

- workflows com estado compartilhado no LangGraph;
- roteamento condicional entre nós;
- memória de curto prazo por `thread_id`;
- memória de longo prazo para preferências do usuário;
- saída estruturada de LLM com Zod;
- persistência e atualização incremental de dados;
- sumarização de conversas;
- testes E2E de uma aplicação baseada em IA.
