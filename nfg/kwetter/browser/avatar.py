

from zope.publisher.browser import BrowserPage
from Products.CMFCore.utils import getToolByName
from plone.scale.scale import scaleImage
import logging
log = logging.getLogger(__name__)

class Avatar(BrowserPage):
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

            member = self.mtool.getMemberById(uid)
            if member is not None:
                if attr in ('icon','fullname'):
                    log.debug("get [%s] for [%s]" %(attr,uid))
                    return getattr(self, attr)(uid)

        return None

    def icon(self, uid):
        try:
            portrait = getattr(self.mdata.portraits,uid)
        except AttributeError:
            return None
        self.request.response.setHeader('Content-type', portrait.content_type)
        return scaleImage(portrait.data, width=32)[0]

    def fullname(self, uid):
        return self.mtool.getMemberInfo(uid).get('fullname')

    def avatar(self):
        return self._path

    def publishTraverse(self, request, name):
        self._path.append(name)
        return self
