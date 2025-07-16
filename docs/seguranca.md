# Segurança Avançada

## Proteção de uploads
- Sempre valide tipo e tamanho dos arquivos
- Armazene arquivos em diretórios protegidos

## Rate limiting
- Use slowapi para limitar requisições

## CORS dinâmico
- Permita apenas origens confiáveis

## CSRF
- Use tokens anti-CSRF em endpoints sensíveis

## Hash de senhas
- Use bcrypt ou argon2

## Backup
- Inclua banco, uploads e Redis 8.0

## LGPD/GDPR
- Veja `docs/lgpd_gdpr.md`

## Versionamento de banco
- Use Alembic

## Logs estruturados
- Backend: loguru
- Frontend: Sentry breadcrumbs 