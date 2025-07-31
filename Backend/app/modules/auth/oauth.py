"""
Módulo de autenticação OAuth para Google e GitHub
"""
from authlib.integrations.starlette_client import OAuth
from starlette.config import Config
from fastapi import HTTPException, Request
from typing import Optional, Dict, Any
import httpx
from ..auth.services import create_access_token
from ...core.config import settings

# Configuração OAuth
config = Config('.env')
oauth = OAuth(config)

# Configuração Google OAuth
oauth.register(
    name='google',
    client_id=settings.GOOGLE_CLIENT_ID,
    client_secret=settings.GOOGLE_CLIENT_SECRET,
    server_metadata_url='https://accounts.google.com/.well-known/openid_configuration',
    client_kwargs={
        'scope': 'openid email profile'
    }
)

# Configuração GitHub OAuth
oauth.register(
    name='github',
    client_id=settings.GITHUB_CLIENT_ID,
    client_secret=settings.GITHUB_CLIENT_SECRET,
    access_token_url='https://github.com/login/oauth/access_token',
    access_token_params=None,
    authorize_url='https://github.com/login/oauth/authorize',
    authorize_params=None,
    api_base_url='https://api.github.com/',
    client_kwargs={'scope': 'user:email'},
)

async def get_google_user_info(token: str) -> Optional[Dict[str, Any]]:
    """Obtém informações do usuário do Google"""
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(
                'https://www.googleapis.com/oauth2/v2/userinfo',
                headers={'Authorization': f'Bearer {token}'}
            )
            if response.status_code == 200:
                user_data = response.json()
                return {
                    'email': user_data.get('email'),
                    'name': user_data.get('name'),
                    'picture': user_data.get('picture'),
                    'provider': 'google',
                    'provider_id': user_data.get('id')
                }
    except Exception:
        # Erro ao obter dados do Google
        pass
    return None

async def get_github_user_info(token: str) -> Optional[Dict[str, Any]]:
    """Obtém informações do usuário do GitHub"""
    try:
        async with httpx.AsyncClient() as client:
            # Obtém dados do usuário
            user_response = await client.get(
                'https://api.github.com/user',
                headers={'Authorization': f'token {token}'}
            )
            
            if user_response.status_code == 200:
                user_data = user_response.json()
                
                # Obtém emails do usuário
                emails_response = await client.get(
                    'https://api.github.com/user/emails',
                    headers={'Authorization': f'token {token}'}
                )
                
                emails = []
                if emails_response.status_code == 200:
                    emails = emails_response.json()
                
                # Encontra o email principal
                primary_email = next(
                    (email['email'] for email in emails if email.get('primary')),
                    user_data.get('email')
                )
                
                return {
                    'email': primary_email,
                    'name': user_data.get('name') or user_data.get('login'),
                    'picture': user_data.get('avatar_url'),
                    'provider': 'github',
                    'provider_id': str(user_data.get('id'))
                }
    except Exception:
        # Erro ao obter dados do GitHub
        pass
    return None

async def authenticate_oauth_user(provider: str, code: str, request: Request) -> Dict[str, Any]:
    """Autentica usuário via OAuth"""
    try:
        if provider == 'google':
            token = await oauth.google.authorize_access_token(request)
            user_info = await get_google_user_info(token['access_token'])
        elif provider == 'github':
            token = await oauth.github.authorize_access_token(request)
            user_info = await get_github_user_info(token['access_token'])
        else:
            raise HTTPException(status_code=400, detail="Provedor OAuth não suportado")
        
        if not user_info:
            raise HTTPException(status_code=400, detail="Não foi possível obter informações do usuário")
        
        # Aqui você pode integrar com seu sistema de usuários
        # Por enquanto, vamos simular um usuário
        user = {
            'email': user_info['email'],
            'name': user_info['name'],
            'provider': user_info['provider'],
            'provider_id': user_info['provider_id'],
            'picture': user_info.get('picture')
        }
        
        # Cria token de acesso
        access_token = create_access_token({"sub": user['email']})
        
        return {
            'user': user,
            'access_token': access_token,
            'message': f'Login realizado com sucesso via {provider.title()}'
        }
        
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Erro na autenticação OAuth: {str(e)}")

def get_oauth_url(provider: str, request: Request) -> str:
    """Gera URL de autorização OAuth"""
    if provider == 'google':
        return oauth.google.authorize_redirect(request, redirect_uri=settings.GOOGLE_REDIRECT_URI)
    elif provider == 'github':
        return oauth.github.authorize_redirect(request, redirect_uri=settings.GITHUB_REDIRECT_URI)
    else:
        raise HTTPException(status_code=400, detail="Provedor OAuth não suportado") 