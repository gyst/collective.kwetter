from Acquisition import aq_inner
from zope.publisher.browser import BrowserPage
from Products.Five.browser import BrowserView
from Products.Five.browser.pagetemplatefile import ViewPageTemplateFile
from Products.CMFCore.utils import getToolByName
from plone.scale.scale import scaleImage
from collective.kwetter.browser.helpers import BrowserMixin
from zope.component import getMultiAdapter

import logging
log = logging.getLogger(__name__)


class Avatar(BrowserPage, BrowserMixin):
    def __init__(self, context, request):
        self.context = context
        self.request = request
        self._path = []
        self.mtool = getToolByName(self, 'portal_membership')
        self.mdata = getToolByName(self, 'portal_memberdata')

    def __call__(self):
        if len(self._path) == 2:
            attr = self._path[0]
            uid = self._path[1]

            (member, uid) = self.memberLookup(self.mtool, uid)
            if member:
                if attr in ('portrait', 'icon', 'fullname'):
                    log.info("get [%s] for [%s]" % (attr, uid))
                    return getattr(self, attr)(uid)

        return None

    def portrait(self, uid):
        try:
            portrait = getattr(self.mdata.portraits, uid)
        except AttributeError:
            default = getattr(self.context, 'defaultUser.png')
            self.request.response.setHeader('Content-type', default.content_type)
            return default._data
        self.request.response.setHeader('Content-type', portrait.content_type)
        return portrait.data

    def icon(self, uid):
        try:
            portrait = getattr(self.mdata.portraits, uid)
        except AttributeError:
            default = getattr(self.context, 'defaultUser.png')
            self.request.response.setHeader('Content-type', default.content_type)
            return scaleImage(default._data, width=32)[0]
        self.request.response.setHeader('Content-type', portrait.content_type)
        return scaleImage(portrait.data, width=32)[0]

    def fullname(self, uid):
        return self.mtool.getMemberInfo(uid).get('fullname')

    def avatar(self):
        return self._path

    def publishTraverse(self, request, name):
        self._path.append(name)
        return self

class Updates(BrowserPage, BrowserMixin):
    def __init__(self, context, request):
        self.context = context
        self.request = request
        self._path = []
        self.mtool = getToolByName(self, 'portal_membership')
        self.mdata = getToolByName(self, 'portal_memberdata')

    def __call__(self):
        if len(self._path) == 1:
            uid = self._path[0]
            (member, uid) = self.memberLookup(self.mtool, uid)
            if member:
                log.info("get updates for [%s]" % uid)
                return self._updates(uid)
        return None

    def publishTraverse(self, request, name):
        self._path.append(name)
        return self

    def _updates(self, uid):
        return """ """

class Author(BrowserPage, BrowserMixin):
    template = ViewPageTemplateFile('templates/author.pt')

    def __init__(self, context, request):
        context = aq_inner(context)
        self.context = context
        self.request = request
        self._path = []
        self.mtool = getToolByName(self, 'portal_membership')
        self.mdata = getToolByName(self, 'portal_memberdata')
        self.utool = getToolByName(self, 'portal_url')

    def __call__(self):
        if len(self._path) == 1:
            uid = self._path[0]
            (self.member, uid) = self.memberLookup(self.mtool, uid)
            if self.member:
                log.info("author view for [%s]" % uid)
                return self.template()
        return None

    def homefolder(self):
        return self.mtool.getHomeFolder(self.member.id)

    @property
    def authorinfo(self):
        return self.mtool.getMemberInfo(self.member.id)

    @property
    def portal_url(self):
        return self.utool.getPortalPath()

    @property
    def gateway(self):
        return '%s/kwetter.gateway' % self.portal_url


    def publishTraverse(self, request, name):
        self._path.append(name)
        return self

class Timeline(BrowserView):
    template = ViewPageTemplateFile('templates/timeline.pt')

    def __call__(self):
        context = aq_inner(self.context)
        self.portal_state = getMultiAdapter((context, self.request),
                                            name=u"plone_portal_state")
        self.utool = getToolByName(self, 'portal_url')
        return self.template()

    @property
    def isAnon(self):
        return self.portal_state.anonymous()

    @property
    def member(self):
        return self.portal_state.member()

    @property
    def username(self):
        return self.member.getUserName()

    @property
    def portal_url(self):
        return self.utool.getPortalPath()

    @property
    def gateway(self):
        return '%s/kwetter.gateway' % self.portal_url

class Following(BrowserView):
    template = ViewPageTemplateFile('templates/following.pt')

    def __call__(self):
        return self.template()

class Followers(BrowserView):
    template = ViewPageTemplateFile('templates/followers.pt')

    def __call__(self):
        return self.template()

