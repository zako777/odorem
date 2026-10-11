"""Project automation tasks.

Run these tasks from the repository root with:

    inv -r core <task>
"""

from pathlib import Path
import os
import shlex
import shutil

from invoke import Context, task


ROOT = Path(__file__).resolve().parent.parent
BACKEND = ROOT / "backend"
MOBILE = ROOT / "frontend" / "mobile"
COMPOSE_FILE = ROOT / "infra" / "docker" / "compose.yml"
COMPOSE = "docker-compose" if shutil.which("docker-compose") else "docker compose"


def _npm(ctx: Context, directory: Path, command: str) -> None:
    """Run an npm script in a project directory."""
    ctx.run(f"cd {shlex.quote(str(directory))} && npm {command}", pty=True)


def _compose(ctx: Context, command: str) -> None:
    """Run a Docker Compose command using the project compose file."""
    ctx.run(
        f"{COMPOSE} -f {shlex.quote(str(COMPOSE_FILE))} {command}",
        pty=True,
    )


@task
def install(ctx: Context) -> None:
    """Install backend and mobile dependencies."""
    _npm(ctx, BACKEND, "ci")
    _npm(ctx, MOBILE, "ci")


@task
def build(ctx: Context) -> None:
    """Build the backend application."""
    _npm(ctx, BACKEND, "run build")


@task
def test(ctx: Context) -> None:
    """Run the backend test suite."""
    test_environment = (
        "NODE_ENV=test "
        "HOST=localhost "
        "LOG_LEVEL=info "
        "APP_KEY=12345678901234567890123456789012 "
        "APP_URL=http://localhost:3333 "
        "SESSION_DRIVER=memory "
        "DB_HOST=127.0.0.1 "
        "DB_PORT=5432 "
        "DB_USER=test "
        "DB_DATABASE=test"
    )
    ctx.run(
        f"cd {shlex.quote(str(BACKEND))} && env {test_environment} npm test",
        pty=True,
    )


@task
def lint(ctx: Context) -> None:
    """Lint the backend and mobile applications."""
    _npm(ctx, BACKEND, "run lint")
    _npm(ctx, MOBILE, "run lint")


@task
def typecheck(ctx: Context) -> None:
    """Run the backend TypeScript type checker."""
    _npm(ctx, BACKEND, "run typecheck")


@task
def check(ctx: Context) -> None:
    """Run linting, type checking, tests, and the backend build."""
    lint(ctx)
    typecheck(ctx)
    test(ctx)
    build(ctx)


@task
def backend(ctx: Context) -> None:
    """Start the backend development server with hot reload."""
    _npm(ctx, BACKEND, "run dev")


@task
def mobile(ctx: Context) -> None:
    """Start the Expo development server for the mobile application."""
    _npm(ctx, MOBILE, "start")


@task(name="docker-build")
def docker_build(ctx: Context) -> None:
    """Build the backend Docker image."""
    _compose(ctx, "build backend")


@task(name="docker-up")
def docker_up(ctx: Context) -> None:
    """Start the backend container in the foreground."""
    if not os.environ.get("APP_KEY"):
        raise RuntimeError("APP_KEY must be set before starting the backend container")
    _compose(ctx, "up backend")


@task(name="docker-down")
def docker_down(ctx: Context) -> None:
    """Stop and remove the backend container."""
    _compose(ctx, "down")


@task(name="docker-logs")
def docker_logs(ctx: Context) -> None:
    """Follow backend container logs."""
    _compose(ctx, "logs --follow backend")
