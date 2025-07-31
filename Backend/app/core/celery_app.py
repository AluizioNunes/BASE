from celery import Celery
from .config import settings
import logging

# Configuração do logger
logger = logging.getLogger(__name__)

# Configuração do Celery com variáveis de ambiente
celery_app = Celery(
    'base_app',
    broker=f'amqp://{settings.RABBITMQ_USER}:{settings.RABBITMQ_PASSWORD}@{settings.RABBITMQ_HOST}:{settings.RABBITMQ_PORT}//',
    backend=f'redis://:{settings.REDIS_PASSWORD}@{settings.REDIS_HOST}:{settings.REDIS_PORT}/{settings.REDIS_DB}',
    include=['app.tasks']  # Inclui módulo de tarefas
)

# Configurações do Celery
celery_app.conf.update(
    task_serializer='json',
    accept_content=['json'],
    result_serializer='json',
    timezone='America/Sao_Paulo',
    enable_utc=True,
    task_track_started=True,
    task_time_limit=30 * 60,  # 30 minutos
    task_soft_time_limit=25 * 60,  # 25 minutos
    worker_prefetch_multiplier=1,
    worker_max_tasks_per_child=1000,
    result_expires=3600,  # 1 hora
)

# Tarefas de exemplo
@celery_app.task(bind=True, name='app.tasks.exemplo_tarefa')
def exemplo_tarefa(self, x: int, y: int) -> int:
    """Tarefa de exemplo para demonstração"""
    logger.info(f"Executando tarefa {self.request.id} com parâmetros x={x}, y={y}")
    try:
        result = x + y
        logger.info(f"Tarefa {self.request.id} concluída com sucesso: {result}")
        return result
    except Exception as e:
        logger.error(f"Erro na tarefa {self.request.id}: {e}")
        raise

@celery_app.task(bind=True, name='app.tasks.processar_arquivo')
def processar_arquivo(self, arquivo_path: str) -> dict:
    """Tarefa para processamento de arquivos"""
    logger.info(f"Iniciando processamento do arquivo: {arquivo_path}")
    try:
        # Simulação de processamento
        import time
        time.sleep(2)
        
        result = {
            "arquivo": arquivo_path,
            "status": "processado",
            "linhas_processadas": 100
        }
        
        logger.info(f"Arquivo {arquivo_path} processado com sucesso")
        return result
    except Exception as e:
        logger.error(f"Erro ao processar arquivo {arquivo_path}: {e}")
        raise 