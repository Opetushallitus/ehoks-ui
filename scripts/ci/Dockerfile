FROM BASEIMAGE

ARG name

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

WORKDIR /root

COPY public /root/public
COPY config.json.template escape-html.py /root/

RUN mkdir -p /tmp/scripts
COPY run run.sh /tmp/scripts/

RUN chown -R nginx:nginx /root

EXPOSE 8080

ENV NAME $name

STOPSIGNAL SIGTERM

CMD ["sh", "/tmp/scripts/run"]
