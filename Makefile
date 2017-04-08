DRYRUN ?= --dry-run
install:
	@echo Installing MyTurn-web from $(PWD)
	sudo rsync -avcz $(DRYRUN) \
	 --exclude='.git*' \
	 . /var/www/myturn-web/
