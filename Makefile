DRYRUN ?= --dry-run
DELETE ?= --delete
devinstall:
	npm install -g react-scripts
install:
	@echo Installing myturn-web from $(PWD)
	sudo rsync -avcz $(DRYRUN) $(DELETE) \
	 . /var/www/myturn-web/
