
import json
from Acquisition import aq_inner
from zope.component import getMultiAdapter
from Products.Five.browser import BrowserView
from nfg.kwetter.m2client import M2Kwetter, SERVER

class Kwetter(BrowserView):
    def __call__(self):
        context = aq_inner(self.context)
        self.portal_state = getMultiAdapter((context, self.request),
                                            name=u"plone_portal_state")

        if self.request.get('REQUEST_METHOD') != 'POST' or self.isAnon:
            return json.dumps('NO')

        client = M2Kwetter(SERVER)
        command = self.request.get('command')
        avatar = self.request.get('avatar')
        message = self.request.get('message')
        since = self.request.get('since')
        follow = self.request.get('follow')
        unfollow = self.request.get('unfollow')
        string = self.request.get('searchableText')
        limit = self.request.get('limit',10)

        info = client.info(avatar)
        if info == u'NO':
            client.reg(avatar, self.member.fullname)
        else:
            info = json.loads(info)
            if info.get('fullname') != self.member.fullname:
                check = client.rereg(avatar, avatar, self.member.fullname)
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
            return json.dumps('NO')
        return json.dumps(result)

    @property
    def isAnon(self):
        return self.portal_state.anonymous()

    @property
    def member(self):
        return self.portal_state.member()

