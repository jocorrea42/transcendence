FROM nginx:latest

COPY /conf/nginx.conf /etc/nginx/nginx.conf
WORKDIR /usr/share/nginx/html
COPY /app/ /usr/share/nginx/html
RUN chmod 777 /usr/share/nginx/html
EXPOSE	80 

CMD ["nginx", "-g", "daemon off;"]
