DRYRUN ?= --dry-run
DELETE ?= --delete
devinstall:
	npm install -g react-scripts
install:
	@echo Installing MyTurn-web from $(PWD)
	sudo rsync -avcz $(DRYRUN) $(DELETE) \
	 --exclude=Makefile \
	 public/ /var/www/myturn-web/
