#!/usr/bin/env bash

./node_modules/.bin/browserify index.js -p esmify -p tinyify -o flask_wire/static/js/bundle.js
