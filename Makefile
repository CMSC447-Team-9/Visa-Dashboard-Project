.PHONY: back

dev-up:
	docker compose -f docker-compose.dev.yml up --build
	
dev-down:
	docker compose -f docker-compose.dev.yml down

prod-up:
	docker compose -f docker-compose.prod.yml up --build -d

prod-down:
	docker compose -f docker-compose.prod.yml down

back:
	cd back && python -m uvicorn api.main:app --host 0.0.0.0 --port 8000

front: 
	cd front && npm run dev