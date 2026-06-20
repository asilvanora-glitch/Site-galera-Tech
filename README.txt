# Galera Tech - Depoimentos dinâmicos

Arquivos principais:

- `index.html`: layout atualizado com a seção de depoimentos dinâmica.
- `api/depoimentos.php`: endpoint que busca depoimentos randômicos no banco.
- `config/conexao.php`: conexão PDO com MySQL/MariaDB.
- `depoimentos.sql`: tabela e dados iniciais.

## Como usar

1. Importe `depoimentos.sql` no phpMyAdmin.
2. Confirme se o banco se chama `galeratech`.
3. Ajuste usuário e senha em `config/conexao.php`.
4. Coloque a pasta no servidor PHP, por exemplo `htdocs/galeratech`.
5. Acesse pelo navegador usando o servidor, não abrindo o HTML direto por duplo clique.

Exemplo local:

http://localhost/galeratech/index.html
