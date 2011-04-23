Microblogging for Plone
=======================

collective.kwetter provides a Plone-integrated frontend for the
`kwetter microblogging engine <https://www.github.com/pjstevns/kwetter>`_.

.. image:: doc/architecture.png


Installation
============

Installation is two-part.


1. Plone
--------

Just depend in your buildout on the egg ``collective.dynatree``. ZCML is loaded 
automagically if z3c.autoinclude is available (default since Plone >=3.3).

Install it as an addon in Plone control-panel or portal_setup.

2. Kwetter backend
------------------

Use the `kwetter buildout <https://www.github.com/pjstevns/kwetter>`_.


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


Status
======

Initial prototype release.
