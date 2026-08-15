# Assistente de Agendamento Médico com LangGraph

Template didático de uma API conversacional para **agendar e cancelar consultas médicas**. O projeto demonstra como representar um atendimento como um grafo: identificar a intenção do paciente, executar a operação adequada e gerar uma resposta final.

> **Estado do projeto:** a estrutura do grafo, os prompts e o serviço em memória já existem, mas os nós principais ainda precisam ser conectados ao modelo de linguagem e ao `AppointmentService`. Portanto, este repositório é um exercício a ser completado, não uma aplicação finalizada.

## Objetivo

A API deve receber mensagens como:

- `Olá, sou Maria Santos e quero agendar com o Dr. Alicio amanhã às 16h para um check-up.`
- `Cancele minha consulta com a Dra. Ana hoje às 14h. Meu nome é João da Silva.`

A partir da mensagem, o fluxo deverá:

1. identificar se o paciente quer agendar, cancelar ou fez uma solicitação desconhecida;
2. extrair paciente, profissional, data, horário e motivo;
3. executar o agendamento ou cancelamento;
4. produzir uma resposta clara e cordial no idioma do paciente.

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
- resultado ou erro da operação.

### Responsabilidade dos nós

- `identifyIntent`: deve classificar a solicitação e extrair os dados usando saída estruturada com Zod.
- `schedule`: deve verificar a disponibilidade e registrar uma consulta.
- `cancel`: deve localizar e remover uma consulta existente.
- `message`: deve transformar o resultado do fluxo em uma resposta amigável para o paciente.

## Componentes

```text
src/
  index.ts                         # Inicialização do servidor HTTP
  server.ts                        # Endpoint POST /chat
  config.ts                        # Configuração planejada do OpenRouter
  graph/
    graph.ts                       # Estado, nós e arestas do LangGraph
    factory.ts                     # Exportação do grafo
    nodes/
      identifyIntentNode.ts
      schedulerNode.ts
      cancellerNode.ts
      messageGeneratorNode.ts
  prompts/v1/
    identifyIntent.ts              # Prompt e schema da classificação
    messageGenerator.ts            # Prompt e schema da resposta final
  services/
    appointmentService.ts          # Agenda em memória
tests/
  router.e2e.test.ts               # Testes HTTP do fluxo
```

O `AppointmentService` mantém profissionais e consultas em memória. Os dados são perdidos quando o processo é encerrado e não devem ser tratados como persistência de produção.

## O que já está implementado

- servidor HTTP com Fastify;
- endpoint `POST /chat` com validação básica;
- estado e roteamento condicional do LangGraph;
- schemas Zod e prompts para classificação e geração da resposta;
- serviço em memória para consultar disponibilidade, agendar e cancelar;
- configuração do LangGraph Studio;
- testes E2E básicos do endpoint.

## O que falta implementar

- criar e configurar o cliente de LLM/OpenRouter;
- usar `IntentSchema` no `identifyIntentNode` e atualizar o estado;
- chamar `bookAppointment` no `schedulerNode`;
- chamar `cancelAppointment` no `cancellerNode`;
- usar `MessageSchema` no `messageGeneratorNode` e adicionar uma `AIMessage`;
- validar campos obrigatórios antes de executar cada ação;
- fortalecer os testes para verificar intenção, resultado e mensagens — atualmente eles validam principalmente o status HTTP;
- substituir o armazenamento em memória caso seja necessária persistência real.

## Pré-requisitos

- Node.js `>= 24.10.0`;
- npm;
- chave do OpenRouter para implementar/executar as chamadas ao modelo;
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

Configurar as chaves, por si só, ainda não completa o projeto: os nós precisam usar o cliente de LLM e o serviço de consultas.

## Executando

Inicie a API:

```bash
npm start
```

Durante o desenvolvimento, com reinicialização automática:

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

O campo `question` é obrigatório e deve conter pelo menos 10 caracteres. No estado atual, a API devolve o estado completo do grafo.

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

Os cenários existentes exercitam solicitações de agendamento e cancelamento por meio do endpoint HTTP. As asserções funcionais estão pendentes até a implementação completa dos nós.

## Conceitos praticados

- modelagem de workflows com LangGraph;
- estado compartilhado entre nós;
- roteamento com arestas condicionais;
- classificação de intenção com LLM;
- saída estruturada e validada com Zod;
- separação entre API, orquestração, prompts e regras de negócio;
- testes E2E de uma aplicação baseada em IA.
