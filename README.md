run-tests:
	docker-compose exec web /bin/bash -c 'pytest $(path)'

build:
	docker-compose build

up:
	docker-compose up -d

install:
	make build
	make up
	sleep 5
	make alembic-upgrade

alembic-autogenerate:
	docker-compose exec web /bin/bash -c 'alembic revision --autogenerate'

alembic-upgrade:
	docker-compose exec web /bin/bash -c 'alembic upgrade head'

---
http://localhost:8003/
---

alembic -> migrations
	docker-compose exec web alembic 
		revision --autogenerate -m "init"
		upgrade head
		downgrade base
		downgrade -1
