# Projetos de Engenharia de Software com IA Aplicada

Repositório central para os módulos, exercícios e projetos da pós-graduação.

## Estrutura

| Módulo | Projeto | Descrição |
| --- | --- | --- |
| 02 — Integração de APIs LLM | [Smart Model Router Gateway](./modulo02-integracao-apis-llm/01-smart-model-router-gateway) | Gateway para roteamento de modelos via OpenRouter. |

## Como usar um projeto

Cada projeto possui suas próprias instruções e dependências. Por exemplo:

```bash
cd modulo02-integracao-apis-llm/01-smart-model-router-gateway
npm install
cp .env.exemple .env
# Preencha OPENROUTER_API_KEY no arquivo .env
npm test
```

> Arquivos `.env`, dependências instaladas e artefatos gerados não são enviados ao GitHub.
