from setuptools import setup, find_packages
import os

version = '0.1'

setup(name='collective.kwetter',
      version=version,
      description="Plone integration for the Kwetter micro-blogging solution",
      long_description=open("README.rst").read(),
      # Get more strings from
      # http://pypi.python.org/pypi?:action=list_classifiers
      classifiers=[
        "Environment :: Web Environment",
        "Framework :: Plone",
        "Framework :: Zope2",
        "License :: OSI Approved :: GNU General Public License (GPL)",
        "Operating System :: OS Independent",
        "Programming Language :: Python :: 2.6",
        ],
      keywords='Zope Plone microblogging',
      author='Paul Stevens and Guido Stevens',
      author_email='paul (at) nfg (dot) nl',
      url='http://www.github.com/collective/kwetter',
      license='GPL',
      packages=find_packages('src'),
      package_dir={'': 'src'},
      namespace_packages=['collective'],
      include_package_data=True,
      zip_safe=False,
      install_requires=[
          'setuptools',
          # -*- Extra requirements: -*-
          'Plone',
      ],
      entry_points="""
      # -*- Entry points: -*-

      [z3c.autoinclude.plugin]
      target = plone
      """,
      setup_requires=[],
      paster_plugins=[],
      )
