from loguru import logger
import sys
import json
from datetime import datetime
from typing import Any, Dict
from .config import settings

class StructuredLogger:
    """Logger estruturado para melhor observabilidade"""
    
    def __init__(self):
        self.logger = logger
        
    def _format_record(self, record: Dict[str, Any]) -> str:
        """Formata o record para JSON estruturado"""
        log_entry = {
            "timestamp": datetime.fromtimestamp(record["time"].timestamp()).isoformat(),
            "level": record["level"].name,
            "logger": record["name"],
            "function": record["function"],
            "line": record["line"],
            "message": record["message"],
            "module": record["module"],
            "process": record["process"].id,
            "thread": record["thread"].id,
        }
        
        # Adiciona extra fields se existirem
        if "extra" in record:
            log_entry.update(record["extra"])
            
        return json.dumps(log_entry, ensure_ascii=False)
    
    def setup_logging(self):
        """Configura o logging estruturado"""
        # Remove handlers padrão
        self.logger.remove()
        
        # Handler para console com formato simples
        self.logger.add(
            sys.stdout,
            format="<green>{time:YYYY-MM-DD HH:mm:ss}</green> | <level>{level: <8}</level> | <cyan>{name}</cyan>:<cyan>{function}</cyan>:<cyan>{line}</cyan> - <level>{message}</level>",
            level="INFO" if not settings.DEBUG else "DEBUG",
            backtrace=True,
            diagnose=True
        )
        
        # Handler para arquivo de logs
        self.logger.add(
            "logs/app.log",
            format="{time:YYYY-MM-DD HH:mm:ss} | {level: <8} | {name}:{function}:{line} - {message}",
            level="INFO",
            rotation="10 MB",
            retention="30 days",
            compression="gz"
        )
        
        # Handler para erros
        self.logger.add(
            "logs/error.log",
            format="{time:YYYY-MM-DD HH:mm:ss} | {level: <8} | {name}:{function}:{line} - {message}",
            level="ERROR",
            rotation="10 MB",
            retention="90 days",
            compression="gz"
        )

# Instância global do logger estruturado
structured_logger = StructuredLogger()
structured_logger.setup_logging()

# Funções utilitárias para logging
def log_request(request_id: str, method: str, url: str, user_agent: str, ip: str):
    """Log de requisições HTTP"""
    logger.info(
        "HTTP Request",
        extra={
            "request_id": request_id,
            "method": method,
            "url": url,
            "user_agent": user_agent,
            "ip": ip,
            "type": "http_request"
        }
    )

def log_response(request_id: str, status_code: int, response_time: float):
    """Log de respostas HTTP"""
    logger.info(
        "HTTP Response",
        extra={
            "request_id": request_id,
            "status_code": status_code,
            "response_time_ms": round(response_time * 1000, 2),
            "type": "http_response"
        }
    )

def log_performance(operation: str, duration: float, metadata: Dict[str, Any] = None):
    """Log de performance"""
    extra = {
        "operation": operation,
        "duration_ms": round(duration * 1000, 2),
        "type": "performance"
    }
    if metadata:
        extra.update(metadata)
    
    logger.info("Performance", extra=extra)

def log_business_event(event: str, user_id: str = None, data: Dict[str, Any] = None):
    """Log de eventos de negócio"""
    extra = {
        "event": event,
        "type": "business_event"
    }
    if user_id:
        extra["user_id"] = user_id
    if data:
        extra["data"] = data
    
    logger.info("Business Event", extra=extra)

def log_error(error: Exception, context: Dict[str, Any] = None):
    """Log de erros"""
    extra = {
        "error_type": type(error).__name__,
        "error_message": str(error),
        "type": "error"
    }
    if context:
        extra.update(context)
    
    logger.error("Error occurred", extra=extra) 