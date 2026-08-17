# Assistente de Agendamento Médico com LangGraph

Projeto didático de uma API conversacional para **agendar e cancelar consultas médicas** usando LangGraph, LangChain, OpenRouter e Fastify.

O objetivo deste item é praticar a integração entre uma API HTTP, um workflow com estado compartilhado, chamadas a LLM com saída estruturada e regras de negócio simples em memória. A aplicação recebe uma mensagem em linguagem natural, identifica a intenção do paciente, extrai os dados necessários, executa a ação correspondente e gera uma resposta final.

## Objetivo

A API deve receber mensagens como:

- `Olá, sou Maria Santos e quero agendar com o Dr. Alicio amanhã às 16h para um check-up.`
- `Cancele minha consulta com a Dra. Ana hoje às 14h. Meu nome é João da Silva.`

A partir da mensagem, o fluxo:

1. identifica se o paciente quer agendar, cancelar ou fez uma solicitação desconhecida;
2. extrai dados como paciente, profissional, data, horário e motivo;
3. valida os campos obrigatórios para a ação;
4. agenda ou cancela a consulta usando o serviço em memória;
5. gera uma mensagem final para o paciente.

## Fluxo do LangGraph

```text
START
  -> identifyIntent
       -> schedule -> message -> END
       -> cancel   -> message -> END
       -> message  -> END       (erro ou intenção desconhecida)
```

O estado compartilhado pelo grafo contém:

- histórico de mensagens;
- intenção: `schedule`, `cancel` ou `unknown`;
- dados do paciente e do profissional;
- data, horário e motivo da consulta;
- resultado ou erro da operação;
- dados do agendamento quando uma consulta é criada.

## Responsabilidade dos Nós

- `identifyIntent`: usa o modelo via OpenRouter para classificar a intenção e extrair dados estruturados com Zod.
- `schedule`: valida `professionalId`, `datetime` e `patientName`, verifica disponibilidade e registra a consulta em memória.
- `cancel`: valida os campos obrigatórios, procura a consulta existente e remove o agendamento.
- `message`: usa o modelo para gerar a resposta final ao paciente e adiciona uma `AIMessage` ao estado.

## Componentes

```text
src/
  index.ts                         # Inicialização do servidor HTTP
  server.ts                        # Endpoint POST /chat
  config.ts                        # Configuração do OpenRouter
  graph/
    graph.ts                       # Estado, nós e arestas do LangGraph
    factory.ts                     # Criação das dependências e exportação do grafo
    nodes/
      identifyIntentNode.ts        # Classificação da intenção com LLM
      schedulerNode.ts             # Agendamento da consulta
      cancellerNode.ts             # Cancelamento da consulta
      messageGeneratorNode.ts      # Geração da resposta final
  prompts/v1/
    identifyIntent.ts              # Prompt e schema da classificação
    messageGenerator.ts            # Prompt e schema da resposta final
  services/
    appointmentService.ts          # Agenda em memória
    oppenRouterService.ts          # Cliente de LLM via OpenRouter
tests/
  router.e2e.test.ts               # Testes HTTP do fluxo
```

## O Que Foi Implementado

- servidor HTTP com Fastify;
- endpoint `POST /chat` com validação básica do campo `question`;
- grafo com estado compartilhado e roteamento condicional;
- integração com OpenRouter usando `ChatOpenAI`;
- geração estruturada via `createAgent`, `providerStrategy` e schemas Zod;
- identificação de intenção e extração de campos;
- validação dos campos obrigatórios antes de agendar ou cancelar;
- agendamento e cancelamento usando `AppointmentService` em memória;
- geração de mensagem final com `AIMessage`;
- configuração para LangGraph Studio;
- testes E2E exercitando os fluxos via endpoint HTTP.

## Observações Importantes

O `AppointmentService` mantém profissionais e consultas em memória. Os dados são perdidos quando o processo é encerrado.

A API atualmente devolve o estado completo do grafo. Isso ajuda durante o estudo porque permite visualizar `intent`, `patientName`, `professionalId`, `actionSuccess`, `appointmentData`, `messages` e possíveis erros. Em uma aplicação de produção, normalmente a resposta HTTP seria reduzida para uma estrutura mais controlada.

Alguns schemas usam Zod v4, enquanto o estado do LangGraph usa `zod/v3` por compatibilidade com `withLangGraph`. Evite misturar versões no mesmo contrato de tipos quando um método espera explicitamente uma delas.

## Pré-requisitos

- Node.js `>= 24.10.0`;
- npm;
- chave do OpenRouter;
- chave do LangSmith apenas se o tracing for utilizado.

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

# Opcionais: observabilidade com LangSmith
LANGSMITH_API_KEY=your_langsmith_api_key_here
LANGCHAIN_TRACING_V2=true
LANGCHAIN_PROJECT=03-medical-appointment
```

## Executando

Inicie a API:

```bash
npm start
```

Durante o desenvolvimento, com reinicialização automática e debugger:

```bash
npm run dev
```

O servidor ficará disponível em `http://localhost:3000`.

Exemplo de requisição:

```bash
curl -X POST http://localhost:3000/chat \
  -H "Content-Type: application/json" \
  -d '{"question":"Olá, sou Maria Santos e quero agendar com o Dr. Alicio amanhã às 16h para um check-up."}'
```

O campo `question` é obrigatório e deve conter pelo menos 10 caracteres.

## LangGraph Studio

Para abrir o grafo no ambiente de desenvolvimento do LangGraph:

```bash
npm run langgraph:serve
```

O grafo é publicado com o nome `medical_appointments`, conforme definido em `langgraph.json`.

## Testes

Execute todos os testes:

```bash
npm test
```

Ou somente os testes E2E:

```bash
npm run test:e2e
```

Durante o desenvolvimento dos testes E2E:

```bash
npm run test:e2e:dev
```

Os testes chamam o endpoint `/chat` com mensagens de agendamento e cancelamento. Como existe chamada real ao modelo, os resultados podem variar conforme o modelo escolhido, disponibilidade do provedor e qualidade da extração estruturada.

## Conceitos Praticados

- criação de workflows com LangGraph;
- passagem de estado entre nós;
- roteamento condicional;
- integração com LLM via OpenRouter;
- saída estruturada com Zod;
- validação de dados antes de executar regras de negócio;
- separação entre API, grafo, prompts, serviços e testes;
- testes E2E em uma aplicação baseada em IA.

## Próximos Passos Possíveis

- padronizar o uso de Zod em todo o fluxo para evitar incompatibilidades de tipos;
- fortalecer as asserções dos testes para validar `patientName`, `actionSuccess`, `appointmentData` e mensagens finais;
- melhorar os prompts com exemplos contendo todos os campos esperados;
- persistir os agendamentos em banco de dados;
- retornar uma resposta HTTP mais enxuta para consumo por frontend ou aplicações externas.
