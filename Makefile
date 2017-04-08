DRYRUN ?= --dry-run
DELETE ?= --delete
install:
	@echo Installing MyTurn-web from $(PWD)
	sudo rsync -avcz $(DRYRUN) $(DELETE) \
	 --exclude=Makefile \
	 public/ /var/www/myturn-web/
