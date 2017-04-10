DRYRUN ?= --dry-run
DELETE ?= --delete
TIMESTAMP := $(shell date +%Y%m%d%H%M%S)
devinstall:
	npm install -g react-scripts
install:
	@echo Installing myturn-web from $(PWD)
	sudo rsync -avcz $(DRYRUN) $(DELETE) \
	 . /var/www/myturn-web/
build: .FORCE
	mv -f public/static /tmp/static-$(TIMESTAMP)
	if npm run build; then \
	 mv build public/static; \
	else \
	 echo Build failed, reverting old "static" >&2; \
	 mv /tmp/static-$(TIMESTAMP) public/static; \
	fi
.FORCE:
