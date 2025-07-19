# Políticas de LGPD/GDPR

## Princípios
- Coletar apenas os dados necessários
- Informar claramente sobre coleta e uso
- Permitir exclusão/portabilidade
- Proteger dados pessoais (criptografia, hash, uploads seguros)
- Manter registros de consentimento (backend e frontend)
- Incluir logs de acesso e alterações
- Backup de banco, uploads e Redis
- Versionamento de banco com Alembic
- Canal de contato para privacidade

## Recomendações Técnicas
- HTTPS obrigatório
- Senhas e dados sensíveis com hash/criptografia (bcrypt, JWT)
- Logs estruturados (backend: loguru, frontend: Sentry)
- Consentimento explícito no frontend (checkbox, política de privacidade)
- Endpoints para exclusão/portabilidade de dados
- Backup e restore testados periodicamente

## Exemplo de endpoint para exclusão de dados
```python
@router.delete("/profile/delete-account")
async def delete_account(user=Depends(get_current_user)):
    # Remove todos os dados do usuário, inclusive uploads
    ...
    return {"message": "Conta excluída com sucesso"}
``` 