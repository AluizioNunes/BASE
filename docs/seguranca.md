# Segurança Avançada

## Proteção de uploads
- Sempre valide tipo e tamanho dos arquivos
- Armazene arquivos em diretórios protegidos e fora do código-fonte
- Sanitização de nomes de arquivos

## Rate limiting
- Use slowapi para limitar requisições (backend)
- Proteja endpoints sensíveis contra brute force

## CORS dinâmico
- Permita apenas origens confiáveis (ex: http://localhost:3000 em dev)
- `allow_credentials=True` para cookies httpOnly

## CSRF
- Use tokens anti-CSRF em endpoints sensíveis (se necessário)
- Cookies httpOnly já mitigam parte do risco

## Hash de senhas
- Use bcrypt (backend)
- Nunca armazene senhas em texto puro

## Autenticação
- JWT via cookie httpOnly
- Endpoints protegidos com Depends(get_current_user)
- Frontend nunca armazena token manualmente

## Backup
- Inclua banco, uploads, Redis e volumes Docker

## LGPD/GDPR
- Veja `docs/lgpd_gdpr.md`

## Versionamento de banco
- Use Alembic

## Logs estruturados
- Backend: loguru
- Frontend: Sentry breadcrumbs 