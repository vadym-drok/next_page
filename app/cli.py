import typer
from sqlmodel import Session

from app.database import engine
from app.fixtures import users, shops
from dotenv import load_dotenv
import logging


load_dotenv()

app_cli = typer.Typer(help="Менеджмент-команди для FastAPI додатку.")


logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


@app_cli.command()
def populate():
    with Session(engine) as session:
        session.add_all(users)
        session.commit()

        session.add_all(shops)
        session.commit()
        logger.info("Магазини додані.")


@app_cli.command()
def runserver(host: str = "127.0.0.1", port: int = 8000):
    """
    Запускає FastAPI сервер.
    """
    import uvicorn
    typer.echo(f"Запуск сервера на {host}:{port}")
    uvicorn.run("app.main:app", host=host, port=port, reload=True)


if __name__ == "__main__":
    app_cli()
