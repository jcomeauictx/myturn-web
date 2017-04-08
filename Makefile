DRYRUN ?= --dry-run
install:
	@echo Installing MyTurn-web from $(PWD)
	sudo rsync -avcz $(DRYRUN) \
	 public/ /var/www/myturn-web/
