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

COPY public /var/www/html/public
COPY config.json.template escape-html.py /opt/ehoks/
RUN ln -s /var/www/html/public/ehoks/index.html /home/oph/index.html
RUN rm -rf /var/tmp
RUN rm -rf /run
RUN ln -s /tmp/var /var/tmp
RUN ln -s /tmp/run /run

RUN mkdir -p /opt/oph/scripts
COPY run run.sh /usr/local/bin/

RUN chown -R nginx:nginx /var/www/html/public

EXPOSE 8080

ENV NAME $name

STOPSIGNAL SIGTERM

CMD ["sh", "/usr/local/bin/run"]
