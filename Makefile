all: build frontend compile

build:
	deno run --allow-all utils/build.js

images:
	# deno run --allow-all utils/images.js

frontend:
	cd web && npm install && npm run build

readme:
	deno run --allow-all utils/readme.js

sync:
	make build readme

compile:
	cp -r web/dist/** dist

fmt:
	deno fmt utils/*.js
