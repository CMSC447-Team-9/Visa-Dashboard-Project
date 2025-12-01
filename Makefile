.PHONY: back

docker-dev:
	docker compose -f docker-compose.dev.yml up --build

docker-prod:
	docker compose -f docker-compose.prod.yml up --build -d

back:
	cd back && python -m uvicorn api.main:app --host 0.0.0.0 --port 8000

front: 
	cd front && npm run dev