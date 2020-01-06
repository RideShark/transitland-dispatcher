FROM node:7
RUN mkdir /dispatcher
WORKDIR /dispatcher
RUN apt-get update && \
    apt-get -y install nginx;

ADD bower.json /dispatcher/bower.json

RUN npm install -g bower
RUN bower install --allow-root

ADD . /dispatcher
RUN npm install -g ember-cli@2.18.2
RUN npm install
RUN npm install --save node-sass


RUN ember build --output-path /var/www/html/dispatcher --environment=staging

EXPOSE 4200

CMD ember s --proxy=http://localhost:3200
