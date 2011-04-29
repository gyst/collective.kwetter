
import json
from Acquisition import aq_inner
from zope.component import getMultiAdapter
from Products.Five.browser import BrowserView
from Products.CMFCore.utils import getToolByName
from collective.kwetter.m2client import M2Kwetter, SERVER
from collective.kwetter.browser.helpers import BrowserMixin

import logging
log = logging.getLogger(__name__)


class Gateway(BrowserView, BrowserMixin):
    """Provide a secured gateway relay between browser and backend.

    This view:
    - takes the browser's AJAX request
    - applies Plone's authentication on it
    - then sends it on as a user-bound JSON to the backend

    """

    def __call__(self):
        context = aq_inner(self.context)
        self.portal_state = getMultiAdapter((context, self.request),
                                            name=u"plone_portal_state")

        self.mtool = getToolByName(self, 'portal_membership')

        if self.request.get('REQUEST_METHOD') != 'POST' or self.isAnon:
            return json.dumps('NO: not allowed')

        client = M2Kwetter(SERVER)
        command = self.request.get('command')
        avatar = self.request.get('avatar')
        message = self.request.get('message')
        since = self.request.get('since')
        follow = self.request.get('follow')
        unfollow = self.request.get('unfollow')
        string = self.request.get('searchableText')
        limit = self.request.get('limit', 10)

        member = self.memberLookup(self.mtool, avatar)[0]
        fullname = member.getProperty('fullname')

        info = client.info(avatar)
        if info == u'NO':
            client.reg(avatar, fullname)
        else:
            info = json.loads(info)
            if info.get('fullname') != fullname:
                client.rereg(avatar, avatar, fullname)

        if command == 'post':
            result = client.post(avatar, message)
        elif command == 'follow':
            result = client.follow(avatar, follow)
        elif command == 'unfollow':
            result = client.unfollow(avatar, unfollow)
        elif command == 'timeline':
            result = client.timeline(avatar, since)
        elif command == 'search':
            result = client.search(avatar, string, since, limit)
        else:
            return json.dumps('NO: invalid command')

        ## add the fullnames to the result
        try:
            data = json.loads(result)
        except ValueError:
            data = result

        if command in ['timeline', 'search']:
            for m in data.get('messages'):
                (member, uid) = self.memberLookup(self.mtool, m[0])
                m.append(member.getProperty('fullname')\
                             or member.getMemberId())

        return json.dumps(data)

    @property
    def isAnon(self):
        return self.portal_state.anonymous()

    @property
    def member(self):
        return self.portal_state.member()
