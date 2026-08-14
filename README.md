# Projetos de Engenharia de Software com IA Aplicada

Repositório central para os módulos, exercícios e projetos da pós-graduação em Engenharia de Software com IA Aplicada.

A proposta deste repositório é reunir pequenos projetos práticos para estudar integração com APIs de LLMs, roteamento de modelos, LangChain, LangGraph e padrões de arquitetura para aplicações com IA.

## Estrutura

| Módulo | Projeto | Descrição |
| --- | --- | --- |
| 02 — Integração de APIs LLM | [Smart Model Router Gateway](./modulo02-integracao-apis-llm/01-smart-model-router-gateway) | Gateway para roteamento de modelos via OpenRouter. |
| 02 — Integração de APIs LLM | [LangChain Intro com LangGraph](./modulo02-integracao-apis-llm/02-langchain-intro) | Introdução ao uso de LangGraph para criar fluxos com estado, nós e arestas condicionais. |

## Como usar um projeto

Cada projeto possui suas próprias instruções, dependências e README. Entre na pasta do projeto desejado antes de instalar dependências ou executar comandos.

Exemplo para o projeto 01:

```bash
cd modulo02-integracao-apis-llm/01-smart-model-router-gateway
npm install
cp .env.exemple .env
# Preencha OPENROUTER_API_KEY no arquivo .env
npm test
```

Exemplo para o projeto 02:

```bash
cd modulo02-integracao-apis-llm/02-langchain-intro
npm install
npm test
npm run dev
```

## Projetos

### 01 — Smart Model Router Gateway

Projeto focado no conceito de gateway inteligente para LLMs. A API recebe uma pergunta no endpoint `/chat` e usa o OpenRouter para escolher um modelo dentro de uma lista configurada, permitindo experimentar criterios como custo e desempenho sem acoplar o cliente a um modelo especifico.

### 02 — LangChain Intro com LangGraph

Projeto focado no conceito de grafo de execucao com LangGraph. A API recebe uma mensagem, identifica a intencao e roteia o fluxo para transformar o texto em uppercase, lowercase ou retornar uma resposta padrao.

Esse exemplo apresenta os conceitos de:

- estado compartilhado;
- nós de processamento;
- arestas entre etapas;
- arestas condicionais;
- exposicao do grafo por uma API Fastify;
- execucao local com LangGraph Studio.

## Observações

Arquivos `.env`, dependências instaladas e artefatos gerados não são enviados ao GitHub.
