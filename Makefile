all: build frontend compile

build:
	deno run --allow-all utils/build.js

frontend:
	cd web && npm install && npm run build

compile:
	cp -r web/dist/** dist