# Projetos de Engenharia de Software com IA Aplicada

Repositório central para os módulos, exercícios e projetos da pós-graduação em Engenharia de Software com IA Aplicada.

A proposta deste repositório é reunir pequenos projetos práticos para estudar integração com APIs de LLMs, roteamento de modelos, LangChain, LangGraph e padrões de arquitetura para aplicações com IA.

## Estrutura

```text
modulo02-integracao-apis-llm/
  01-smart-model-router-gateway/
  02-langchain-intro/
  03-medical-appointment-template/
  03-medical-appointment-z/
```

| Item | Projeto                                                                                        | Objetivo                                                                                             |
| ---- | ---------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| 01   | [Smart Model Router Gateway](./modulo02-integracao-apis-llm/01-smart-model-router-gateway)     | Criar uma API intermediária para chamadas a LLMs usando OpenRouter e roteamento de modelos.          |
| 02   | [LangChain Intro com LangGraph](./modulo02-integracao-apis-llm/02-langchain-intro)             | Introduzir LangGraph com estado compartilhado, nós, arestas e roteamento condicional.                |
| 03   | [Medical Appointment Template](./modulo02-integracao-apis-llm/03-medical-appointment-template) | Disponibilizar o template didático do assistente de agendamento médico.                              |
| 03   | [Medical Appointment Z](./modulo02-integracao-apis-llm/03-medical-appointment-z)               | Implementar o assistente de agendamento médico com LangGraph, OpenRouter, Zod, Fastify e testes E2E. |

## Como usar um projeto

Cada projeto possui suas próprias instruções, dependências e README. Entre na pasta do projeto desejado antes de instalar dependências ou executar comandos.

Fluxo comum:

```bash
cd modulo02-integracao-apis-llm/<projeto>
npm install
```

Quando o projeto usar OpenRouter, crie o arquivo `.env` com a chave:

```bash
cp .env.example .env
```

Preencha:

```env
OPENROUTER_API_KEY=your_openrouter_api_key_here
```

Alguns projetos antigos podem usar o arquivo de exemplo com o nome `.env.exemple`.

## Projetos

### 01 — Smart Model Router Gateway

Projeto focado no conceito de gateway inteligente para LLMs. A API recebe uma pergunta no endpoint `/chat` e usa o OpenRouter para escolher um modelo dentro de uma lista configurada, permitindo experimentar critérios como custo e desempenho sem acoplar o cliente a um modelo específico.

Principais conceitos:

- API Fastify para chamadas de chat;
- encapsulamento da integração com OpenRouter;
- lista de modelos configurável;
- estratégia de roteamento por preço, throughput ou outro critério do provedor.

### 02 — LangChain Intro com LangGraph

Projeto focado no conceito de grafo de execução com LangGraph. A API recebe uma mensagem, identifica a intenção e roteia o fluxo para transformar o texto em uppercase, lowercase ou retornar uma resposta padrão.

Esse exemplo apresenta os conceitos de:

- estado compartilhado;
- nós de processamento;
- arestas entre etapas;
- arestas condicionais;
- exposição do grafo por uma API Fastify;
- execução local com LangGraph Studio.

### 03 — Medical Appointment Template

Template didático do assistente de agendamento médico. Ele apresenta a estrutura base do fluxo, os nós, os prompts, os schemas e o serviço de agenda em memória, mantendo partes importantes como exercício de implementação.

Use este projeto como ponto de partida para praticar:

- modelagem de um atendimento como grafo;
- desenho do estado compartilhado;
- separação entre API, grafo, prompts e regra de negócio;
- implementação incremental dos nós.

### 03 — Medical Appointment Z

Versão implementada do assistente de agendamento médico. A API recebe mensagens em linguagem natural, identifica se o paciente deseja agendar ou cancelar uma consulta, extrai dados estruturados, executa a operação no serviço em memória e gera uma resposta final.

Esse projeto consolida:

- LangGraph com múltiplos nós e roteamento condicional;
- OpenRouter via `ChatOpenAI`;
- saída estruturada com Zod;
- validação de campos obrigatórios;
- serviço de agendamento em memória;
- geração de resposta final com `AIMessage`;
- testes E2E chamando o endpoint `/chat`.

## Comandos Úteis

Dentro de cada projeto, os comandos mais comuns são:

```bash
npm run dev
npm test
```

Nos projetos com LangGraph Studio:

```bash
npm run langgraph:serve
```

Consulte o README de cada pasta para detalhes de variáveis de ambiente, endpoints e exemplos de requisição.

## Observações

Arquivos `.env`, dependências instaladas e artefatos gerados não são enviados ao GitHub. Cada projeto deve ser executado a partir da sua própria pasta para evitar conflito entre dependências, scripts e variáveis de ambiente.
