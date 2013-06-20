

default: all

lucid:
	sudo apt-get install gcc libc6-dev python2.6-dev python-imaging python-setuptools zlib1g-dev libjpeg-dev python-profiler

all: bin/python bin/buildout
	bin/buildout -v

bin/buildout: bin/python
	bin/python ./bootstrap.py

bin/python:
	virtualenv --clear .

test:
	bin/test -s collective.kwetter


