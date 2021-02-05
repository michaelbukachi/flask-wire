# -*- coding: UTF-8 -*-
"""
Flask-Wire
-------------
Flask extension that implements "Html over the wire"
"""
try:
    from setuptools import setup
except:
    from distutils.core import setup

import codecs

version = '1.0.0a3'

setup(
    name='Flask-Wire',
    version=version,
    url='https://github.com/michaelbukachi/flask-wire',
    license='MIT',
    author='Michael Bukachi',
    author_email='michaelbukachi@gmail.com',
    description='Flask extension that implements "Html over the wire"',
    long_description=codecs.open('README.rst', 'r', 'utf-8').read(),
    packages=['flask_wire'],
    zip_safe=False,
    include_package_data=True,
    platforms='any',
    install_requires=[
        'Flask>=0.11'
    ],
    python_requires='>=3.6',
    classifiers=[
        'Development Status :: 4 - Beta',
        'Environment :: Web Environment',
        'Framework :: Flask',
        'Intended Audience :: Developers',
        'License :: OSI Approved :: MIT License',
        'Operating System :: OS Independent',
        'Programming Language :: Python',
        'Programming Language :: Python :: 3',
        'Programming Language :: Python :: 3.6',
        'Programming Language :: Python :: 3.7',
        'Programming Language :: Python :: 3.8',
        'Topic :: Internet :: WWW/HTTP :: Dynamic Content',
        'Topic :: Software Development :: Libraries :: Python Modules',
    ]
)