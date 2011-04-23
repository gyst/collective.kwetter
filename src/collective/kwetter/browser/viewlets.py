
from zope.component import getMultiAdapter
from Products.Five.browser.pagetemplatefile import ViewPageTemplateFile
from plone.app.layout.viewlets.common import ViewletBase
from Products.CMFCore.utils import getToolByName

class KwetterTimeLine(ViewletBase):
    render = ViewPageTemplateFile('templates/timeline.pt')

    def __init__(self, context, request, view, manager):
        super(KwetterTimeLine,self).__init__(context, request,
                                                   view, manager)
        self.__parent__ = view
        self.view = view
        self.manager = manager
        self.portal_state = getMultiAdapter((context, self.request), name=u"plone_portal_state")
        self.utool = getToolByName(self, 'portal_url')

    @property
    def isAnon(self):
        return self.portal_state.anonymous()

    @property
    def member(self):
        return self.portal_state.member()

    @property
    def portal_url(self):
        return self.utool.getPortalPath()
