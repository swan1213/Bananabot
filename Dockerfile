FROM python:3.5

# Install Node
RUN curl -sL https://deb.nodesource.com/setup_4.x | bash - 
RUN apt-get install -y nodejs
RUN npm install -g npm

ENV PYTHONUNBUFFERED 1
RUN mkdir /app
RUN mkdir /app/code
WORKDIR /app
RUN export PYTHONPATH=$PYTHONPATH:/app

# Install JavaScript requirements
COPY package.json /app/
RUN npm install -d

# Link gulp
RUN ln -s /app/node_modules/.bin/gulp /usr/bin/gulp

COPY . /app/code/
RUN ls /app/code/
WORKDIR /app/code

# Build webpack files
RUN gulp build

EXPOSE 8000
CMD gulp serve
