

from zope.publisher.browser import BrowserPage
from Products.CMFCore.utils import getToolByName
from plone.scale.scale import scaleImage

class Avatar(BrowserPage):
    def __init__(self, context, request):
        self.context = context
        self.request = request
        self._path = []
        self.mtool = getToolByName(self, 'portal_membership')

    def __call__(self):
        if len(self._path) == 2:
            attr = self._path[0]
            uid = self._path[1]

            member = self.mtool.getMemberById(uid)
            if member is not None:
                if attr in ('icon','fullname'):
                    return getattr(self, attr)(member)

        return None

    def icon(self, member):
        portrait = member.getPersonalPortrait()
        width = portrait.width
        factor = 32.0/float(width)
        self.request.response.setHeader('Content-type', portrait.content_type)
        result = scaleImage(portrait.data, width=32)
        return result[0]

    def fullname(self, member):
        return member.getProperty('fullname')

    def avatar(self):
        return self._path

    def publishTraverse(self, request, name):
        self._path.append(name)
        return self
