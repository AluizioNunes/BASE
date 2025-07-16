# Políticas de LGPD/GDPR

## Princípios
- Coletar apenas os dados necessários
- Informar claramente sobre coleta e uso
- Permitir exclusão/portabilidade
- Proteger dados pessoais (criptografia, hash, uploads seguros)
- Manter registros de consentimento
- Incluir logs de acesso e alterações
- Backup de banco, uploads e Redis
- Versionamento de banco com Alembic

## Recomendações Técnicas
- HTTPS obrigatório
- Senhas e dados sensíveis com hash/criptografia
- Logs estruturados (backend e frontend)
- Canal de contato para privacidade

## Exemplo de endpoint para exclusão de dados
```python
@router.delete("/me/delete-account")
async def delete_account(user=Depends(get_current_user)):
    # Remove todos os dados do usuário, inclusive uploads
    ...
    return {"message": "Conta excluída com sucesso"}
``` 