#!bin/bash

wget "http://www.adminer.org/latest.php" -O /usr/share/nginx/html/adminer.php
chown -R www-data:www-data /usr/share/nginx/html/adminer.php
chmod 777 /usr/share/nginx/html/adminer.php

cd /usr/share/nginx/html

php -S "0.0.0.0:8080"
