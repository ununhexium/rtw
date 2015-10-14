DIR:=$(strip $(shell dirname $(realpath $(lastword $(MAKEFILE_LIST)))))

IMG_REMOTE=/mnt/hubic/default/Data/rtw/img/
IMG_LOCAL=$(DIR)/../jekyll/img/
SERVER=lab0.net
SERVER_USER=ununhexium

RSYNC_OPT=--no-perms --no-owner --no-group --verbose --recursive --update

get-img:
	rsync $(RSYNC_OPT) $(IMG_REMOTE) $(IMG_LOCAL)

put-img:
	rsync $(RSYNC_OPT) $(IMG_LOCAL) $(IMG_REMOTE)

img: get-img

info:
	@echo Makefile directory "$(DIR)"
	@echo Local images dir "$(IMG_LOCAL)"
	@echo Backed images dir "$(IMG_REMOTE)"

build:
	cd $(DIR)/../jekyll; jekyll build

upload: img build
	@echo Upload to $(SERVER_USER)@$(SERVER)
	rsync --delete -vr $(DIR)/../jekyll/_site/ $(SERVER_USER)@$(SERVER):/home/$(SERVER_USER)/html/

