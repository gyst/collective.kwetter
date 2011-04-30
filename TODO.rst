TODO
====

This is the development roadmap for collective.kwetter.


0.2 provide a strong development baseline
-----------------------------------------

  - provide test coverage on gateway.py
  - provide test coverage on kwetter.js
  - document and sanitize internal call flow and API
  - extract input form from timeline viewlet into separate viewlet
  - extract all html markup from kwetter.js into template
  - provide more graceful styling and jQuery transitions

Helper view:

  - kwetter.lib:          reusable view widget library


0.3 standalone views
--------------------

Provide a set of interlinked views that realize a complete
Twitter-like experience.

  - kwetter.timeline:     received messages (all / by user)
  - kwetter.following:    subscriptions (my / by user)
  - kwetter.followers:    subscribers (my / by user)
  - kwetter.updates:      sent messages (my / by user)
  - kwetter.profile:      user info (to be integrated with Plone /author)
  - kwetter.search:       archive/user search
  - kwetter.preferences:  my settings (autofollow on/off)
  - kwetter.controlpanel: admin global settings (autofollow default on/off)


0.4 portlets and viewlets
-------------------------

Provide a set of portlets and viewlets that can be used by integrators
to interleave microblogging functionality with other page views.

