# Segurança Avançada

## Proteção de uploads
- Sempre valide tipo e tamanho dos arquivos
- Armazene arquivos em diretórios protegidos e fora do código-fonte
- Sanitização de nomes de arquivos

## Rate limiting
- Use slowapi 0.1.9 para limitar requisições (backend)
- Proteja endpoints sensíveis contra brute force

## CORS dinâmico
- Permita apenas origens confiáveis (ex: http://localhost:3000 em dev)
- `allow_credentials=True` para cookies httpOnly

## CSRF
- Use tokens anti-CSRF em endpoints sensíveis (se necessário)
- Cookies httpOnly já mitigam parte do risco

## Hash de senhas
- Use bcrypt 4.3.0 (backend)
- Nunca armazene senhas em texto puro

## Autenticação
- JWT via cookie httpOnly (FastAPI 0.116.1, python-jose 3.5.0)
- Endpoints protegidos com Depends(get_current_user)
- Frontend (React 19.1.0 + Vite 7.0.5) nunca armazena token manualmente

## Backup
- Inclua banco, uploads, Redis 6.2.0 e volumes Docker

## LGPD/GDPR
- Veja `docs/lgpd_gdpr.md`

## Versionamento de banco
- Use Alembic 1.16.4

## Logs estruturados
- Backend: loguru 0.7.3
- Frontend: Sentry 2.33.0 breadcrumbs 