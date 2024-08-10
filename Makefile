all: build run

build:
	docker build -t token-fetcher .

run:
	docker run --rm -p "3333:3333" -v ${PWD}/.data:/src/.data --name token-fetcher-container token-fetcher
