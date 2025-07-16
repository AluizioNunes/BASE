# Módulo de Arquivos

## Endpoints
- `POST /api/v1/files/upload` – Upload seguro de arquivos
- `GET /api/v1/files/download/{filename}` – Download seguro de arquivos

## Boas práticas
- Sempre valide o tipo e tamanho dos arquivos enviados
- Armazene arquivos em diretórios protegidos
- Nunca exponha caminhos absolutos ao usuário 