# Regra fixa: formulário de aplicação → Tamires

O formulário `#form-aplicacao` (seção "Aplicação" do `index.html`) manda cada aplicação para o n8n da Tamires, que chama o lead no WhatsApp cerca de 1 minuto depois. Se a ligação quebrar, os leads somem sem aviso.

## Não alterar

- As constantes `TAMIRES_URL`, `TAMIRES_ORIGEM` e `TAMIRES_TOKEN` no topo de `js/main.js`.
- O bloco "Formulário de aplicação → Tamires" no fim de `js/main.js`: o `fetch` (POST JSON) e o formato `{ origem, token, nome, telefone, respostas: [{ pergunta, resposta }] }`.
- O `id="form-aplicacao"` e o botão `type="submit"`.
- Os `name` dos campos: `nome`, `whatsapp`, `negocio`, `perfil`, `faturamento`, `problema`, `motivo`, `compromisso`.
- O campo WhatsApp continua obrigatório.
- Não trocar o envio por mailto, link do WhatsApp (wa.me), Supabase, Formspree ou qualquer outro serviço.

## Pode alterar

- Visual: cores, fontes, espaçamento, layout, animações.
- Textos de título, rótulos e placeholders, desde que os `name` continuem os mesmos.

## Lovable

Se o projeto for convertido para React, mantenha o mesmo envio: no submit, `fetch` POST para `TAMIRES_URL` com o mesmo JSON. Nada de trocar por backend próprio do Lovable.

Para adicionar, remover ou renomear um campo, combine antes com o Thiago, porque a Tamires precisa ser ajustada junto.
