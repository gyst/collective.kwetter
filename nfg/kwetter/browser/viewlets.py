
from Products.Five.browser.pagetemplatefile import ViewPageTemplateFile
from plone.app.layout.viewlets.common import ViewletBase

class KwetterTimeLine(ViewletBase):
    render = ViewPageTemplateFile('templates/timeline.pt')

    def update(self):
        self.timeline = 'test'


