from celery import Celery

celery_app = Celery(
    'app',
    broker='amqp://guest:guest@localhost:5672//',
    backend='redis://localhost:6379/0'
)

@celery_app.task
def exemplo_tarefa(x, y):
    return x + y 