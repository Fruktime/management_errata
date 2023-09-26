#!/bin/sh -eu

update_chrooted all

cat /etc/nginx/templates/default.conf.template > /etc/nginx/sites-enabled.d/default.conf
nginx -g "daemon off;"
