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

class KwetterBrowserPage(BrowserPage, BrowserMixin):

    def __init__(self, context, request):
        context = aq_inner(context)
        self.member = None
        self.context = context
        self.request = request
        self._path = []
        self.mtool = getToolByName(self, 'portal_membership')
        self.mdata = getToolByName(self, 'portal_memberdata')
        self.utool = getToolByName(self, 'portal_url')
        self.portal_state = getMultiAdapter((context, self.request),
                                            name=u"plone_portal_state")

    def safe_member_id(self, id = None):
        if id is not None:
            return self.mtool._getSafeMemberId(id)
        if self.member is not None:
            return self.mtool._getSafeMemberId(self.member.id)

    @property
    def auth_username(self):
        return self.portal_state.member().getUserName()


class Avatar(KwetterBrowserPage):
    def __call__(self):
        if len(self._path) == 2:
            attr = self._path[0]
            uid = self._path[1]

            (member, uid) = self.memberLookup(self.mtool, uid)
            if member:
                uid = self.safe_member_id(uid)
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
            return scaleImage(default._data, width=64)[0]
        self.request.response.setHeader('Content-type', portrait.content_type)
        return scaleImage(portrait.data, width=64)[0]

    def fullname(self, uid):
        return self.mtool.getMemberInfo(uid).get('fullname')

    def avatar(self):
        return self._path

    def publishTraverse(self, request, name):
        self._path.append(name)
        return self

class Author(KwetterBrowserPage):
    template = ViewPageTemplateFile('templates/author.pt')

    def __call__(self):
        if len(self._path) == 1:
            uid = self._path[0]
            (self.member, uid) = self.memberLookup(self.mtool, uid)
            if self.member:
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

class KwetterBrowserView(BrowserView):

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

class Timeline(KwetterBrowserView):
    template = ViewPageTemplateFile('templates/timeline.pt')

class Following(Author):
    template = ViewPageTemplateFile('templates/following.pt')

class Followers(Author):
    template = ViewPageTemplateFile('templates/followers.pt')

class Search(KwetterBrowserView):
    template = ViewPageTemplateFile('templates/search.pt')
