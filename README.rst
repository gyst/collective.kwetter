Microblogging for Plone
=======================

collective.kwetter provides a Plone-integrated frontend for the
`kwetter microblogging engine <https://www.github.com/pjstevns/kwetter>`_.

The goal of collective.kwetter + kwetter is to provide Twitter-like
microblogging capabilities inside of Plone.


Status
======

Initial prototype release.

Currently all users get all messages from all users.

Follow/Unfollow functionality is present in the backend but not yet
exposed in collective.kwetter.

TODO:
-----

- full dashboard
- follow/unfollow
- @attribution and #hashtag linking
- Plone Member profile integration
- etc...


Installation
============

Installation is two-part.


1. Plone
--------

Just depend in your buildout on the egg ``collective.kwetter``.

Install it as an addon in Plone control-panel or portal_setup.

Reference target is Plone4, untested in Plone3.

Collective.kwetter itself contains a minimal plone4 buildout configuration
so you can quickly test and evaluate it.

An example minimal Plone4 buildout configuration with collective.kwetter::

  [buildout]
  parts = instance
  extends = http://dist.plone.org/release/4.0-latest/versions.cfg
  find-links = 
      http://dist.repoze.org/     
  
  [instance]
  recipe = plone.recipe.zope2instance
  eggs =
      PIL    
      collective.kwetter
      
  zcml = 
      collective.kwetter



2. Kwetter backend
------------------

Use the `kwetter buildout <https://www.github.com/pjstevns/kwetter>`_.

This will install and run the various kwetter backend daemons.

Note that this is not a Plone buildout, but a separate standalone buildout.


Architecture
============

As a Plone developer, you can use the kwetter backend as a 'black box'
by just using the JSON API.

The kwetter system consists of the following components:

1. `collective.kwetter <https://www.github.com/collective/collective.kwetter>`_.
   The Plone frontend, which contains:
   - kwetter.js AJAX browser component
   - Plone integration and view logic
   - backend gateway client

2. `kwetter <https://www.github.com/pjstevns/kwetter>`_ backend.
   Buildout-driven installer for the kwetter backend. This installs:
   - mongrel2
   - kwetter.core

3. `kwetter.core <https://www.github.com/pjstevns/kwetter.core>`_.
   The actual messaging backend logic. This runs:
   - kwetter-m2 mongrel request handler
   - kwetterd message routing and storage

Collective.kwetter communicates with JSON over HTTP with both the web browser and with the kwetter backend.

The various kwetter backend components communicate with JSON over ZeroMQ.

.. image:: https://github.com/gyst/collective.kwetter/raw/master/docs/architecture.png


Source Code and Contributions
=============================

Contributions are welcome. The source is hosted on
`github collective <https://github.com/collective/collective.kwetter>`_.

You can clone it or `get access to the github-collective 
<http://collective.github.com/>`_ and work directly on the project. 

Maintainers of collective.kwetter are Guido Stevens and Paul Stevens. We
appreciate any contribution and if a release is needed to be done on pypi, 
please just contact one of us.


Contributors
============

- Paul Stevens <paul@nfg.nl>

- Guido Stevens <guido.stevens@cosent.net>



