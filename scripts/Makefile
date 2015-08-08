DIR:=$(strip $(shell dirname $(realpath $(lastword $(MAKEFILE_LIST)))))

IMG_REMOTE=/mnt/rtw/img/
IMG_LOCAL=$(DIR)/../jekyll/img/

RSYNC_OPT=--no-perms --no-owner --no-group --verbose --recursive --update

get-img:
	rsync $(RSYNC_OPT) $(IMG_REMOTE) $(IMG_LOCAL)

put-img:
	rsync $(RSYNC_OPT) $(IMG_LOCAL) $(IMG_REMOTE)

img: get-img put-img

info:
	@echo Makefile directory "$(DIR)"
	@echo Local images dir "$(IMG_LOCAL)"
	@echo Backed images dir "$(IMG_REMOTE)"


