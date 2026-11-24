# Plano de testes

## 1. Escopo

Dentro do escopo:

- Interface de https://www.saucedemo.com: login, lista de produtos e ordenação, carrinho, checkout, usuário bloqueado, usuário `problem_user`.
- API de https://restful-booker.herokuapp.com: autenticação, criar/ler/atualizar/apagar reserva, casos negativos.

Fora do escopo: desempenho, segurança, acessibilidade, outros navegadores além do Chromium, dispositivos móveis, usuários `performance_glitch_user`, `error_user` e `visual_user`.

Os dois sites são públicos e feitos para prática de testes. Os dados usados são fictícios.

## 2. Abordagem

- Playwright + TypeScript, só Chromium.
- Testes de interface com Page Object Model simples (pasta `pages/`).
- Testes de API com o cliente HTTP do Playwright (`request`).
- Dados de teste em `fixtures/`.
- Cada teste é independente: a interface começa com login novo e a API cria a própria reserva.
- CI no GitHub Actions, com relatório HTML como artefato.

## 3. Riscos

| Risco | Efeito | Mitigação |
|---|---|---|
| Sites públicos podem sair do ar ou ficar lentos | Testes falham sem erro no código | 1 nova tentativa no CI; relatório e trace guardados |
| A API demo é compartilhada e reiniciada de tempos em tempos | Dados criados podem sumir | Cada teste cria o que usa |
| O comportamento dos sites pode mudar | Testes quebram | Seletores `data-test`; mensagens verificadas por trecho |
| A API não segue boas práticas (ex.: 500 em vez de 400) | Teste frágil se exigir um código exato | Teste só exige que seja um erro (>= 400) e o README registra |

## 4. Casos de teste

### Interface

| ID | Caso | Resultado esperado | Arquivo |
|---|---|---|---|
| UI-01 | Login com usuário padrão | Vai para a lista com 6 produtos | login.spec.ts |
| UI-02 | Login com usuário bloqueado | Mensagem de usuário bloqueado, fica no login | login.spec.ts |
| UI-03 | Senha errada | Mensagem de credenciais não conferem | login.spec.ts |
| UI-04 | Usuário vazio | Mensagem "Username is required" | login.spec.ts |
| UI-05 | Abrir /inventory.html sem login | Volta ao login com aviso | login.spec.ts |
| UI-06 | Logout | Volta ao login | login.spec.ts |
| UI-07 | Adicionar item | Contador do carrinho = 1 | cart.spec.ts |
| UI-08 | Remover item | Contador some | cart.spec.ts |
| UI-09 | Carrinho lista itens | 2 itens adicionados, 2 listados | cart.spec.ts |
| UI-10 | Ordenar preço crescente | Preços em ordem crescente | cart.spec.ts |
| UI-11 | Ordenar preço decrescente | Preços em ordem decrescente | cart.spec.ts |
| UI-12 | Compra completa | "Thank you for your order!" | checkout.spec.ts |
| UI-13 | Checkout com formulário vazio | "First Name is required" | checkout.spec.ts |
| UI-14 | Checkout sem CEP | "Postal Code is required" | checkout.spec.ts |
| UI-15 | `problem_user`: imagens (bug conhecido) | 6 imagens diferentes; hoje falha (`test.fail()`) | problem-user.spec.ts |

### API

| ID | Caso | Resultado esperado | Arquivo |
|---|---|---|---|
| API-01 | GET /ping | 201 | booking.spec.ts |
| API-02 | Auth válida | Devolve token | booking.spec.ts |
| API-03 | Auth com senha errada | Sem token, motivo "Bad credentials" | booking.spec.ts |
| API-04 | Criar reserva | Devolve id e os dados enviados | booking.spec.ts |
| API-05 | Ler reserva criada | 200 e mesmos dados | booking.spec.ts |
| API-06 | Atualizar com token | 200 e dados novos | booking.spec.ts |
| API-07 | Apagar com token | 201; depois GET dá 404 | booking.spec.ts |
| API-08 | Apagar sem token | 403 | booking.spec.ts |
| API-09 | Ler reserva inexistente | 404 | booking.spec.ts |
| API-10 | Criar com campos faltando | Erro (>= 400) | booking.spec.ts |

## 5. Critérios

- Entrada: Node 20+ instalado, Chromium do Playwright instalado, acesso à internet.
- Passou: todos os testes verdes; UI-15 conta como verde enquanto o bug existir.
- Falhou: qualquer teste vermelho. Primeiro rodar de novo para separar falha real de instabilidade do site.
- Saída: relatório HTML gerado (`npx playwright show-report`).

## 6. Não coberto

Dados de cartão, pagamento real, carga, e-mails, validação de contrato (schema) da API.
