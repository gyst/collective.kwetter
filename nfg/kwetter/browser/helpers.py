
from Products.PlonePAS.utils import cleanId

class BrowserMixin(object):

    def memberLookup(self, mtool, uid):
        member = mtool.getMemberById(uid)
        if member is None:
            for m in mtool.listMemberIds():
                m2 = mtool.getMemberById(m)
                if m2.getUserName() == uid:
                    uid = cleanId(m)
                    member = m2
                    break
        return (member, uid)

