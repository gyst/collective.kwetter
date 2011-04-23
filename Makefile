

default: all

lucid:
	sudo apt-get install gcc libc6-dev python2.6-dev python-imaging python-setuptools zlib1g-dev libjpeg-dev python-profiler

all: .virtualenv 
	bin/buildout -v

.virtualenv:
	virtualenv --clear -p python2.6 --no-site-packages --distribute .
	bin/easy_install zc.buildout
	bin/easy_install distribute==0.6.14
	bin/easy_install Paste==1.7.4
	bin/easy_install PasteDeploy==1.3.3
	bin/easy_install PasteScript==1.7.3


test:
	bin/instance test -s collective.kwetter


