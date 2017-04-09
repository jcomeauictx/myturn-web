DRYRUN ?= --dry-run
DELETE ?= --delete
devinstall:
	sudo npm install -g --dev
install:
	@echo Installing MyTurn-web from $(PWD)
	sudo rsync -avcz $(DRYRUN) $(DELETE) \
	 --exclude=Makefile \
	 public/ /var/www/myturn-web/
