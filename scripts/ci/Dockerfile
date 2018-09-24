FROM BASEIMAGE

RUN apk update \
        # install nginx
        && apk add nginx \
        # make stdout and stderr point to nginx logs
        && ln -sf /dev/stdout /var/log/nginx/access.log \
        && ln -sf /dev/stderr /var/log/nginx/error.log \
        # make directory for nginx pid file
        && mkdir -p /run/nginx \
        # remove apk index files
        && rm -rf /var/cache/apk/*

COPY nginx-server.conf /etc/nginx/conf.d/default.conf

WORKDIR /root/public

COPY 404.html 50x.html index.html /root/public/
COPY dist /root/public/dist
COPY run.sh escape-html.py config.json.template /root/

RUN chown -R nginx:nginx /root

EXPOSE 8080

STOPSIGNAL SIGTERM

CMD ["bash", "/root/run.sh"]
