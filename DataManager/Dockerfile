FROM docker.io/centos:7.4.1708
MAINTAINER KOSYAS <jjw1001@kosyas.com>
EXPOSE 3001

USER root

# install node npm
RUN yum install -y epel-release\
&& yum install -y nodejs --enablerepo=epel\
&& yum install -y npm --enablerepo=epel\
&& yum install -y git\
&& yum install -y gcc

# RUN pip install --upgrade pip

RUN git clone https://github.com/kimnamgyun/kosysas-backend.git

#install elastalert
RUN yum install -y python\
&& yum install -y python-devel\
&& yum install -y python-pip

RUN mkdir /elastalert-server\
&& cd /elastalert-server\
&& git clone https://github.com/bitsensor/elastalert.git

RUN git clone https://github.com/Yelp/elastalert.git

RUN cd /elastalert\
&& pip install --upgrade pip\
&& pip install --upgrade setuptools\
&& pip install -r requirements.txt\
&& python setup.py install

RUN cd /kosysas-backend/DataManager

#RUN npm install

CMD ["/shell/start.sh"]
