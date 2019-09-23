install:
	docker run -t --rm -v `pwd`:/app  -w /app node:12.4.0-alpine npm install

test:
	docker run -t --rm -v `pwd`:/app -w /app node:12.4.0-alpine npm run test

start:
	docker run -ti --rm -v `pwd`:/app -w /app -p 8080:8080 node:12.4.0-alpine npm run start -- --host=0.0.0.0

package:
	tar -zcvf ./docs/`git describe --abbrev=0 --tags`.tar.gz `git ls-tree -r master --name-only | sed '/docs/d'`
	cd docs && ln -sf ./`git describe --abbrev=0 --tags`.tar.gz ./latest.tar.gz && cd -
	cp ./README.md ./docs/README.md
