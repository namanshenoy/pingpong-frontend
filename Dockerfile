FROM node:11.15.0
LABEL MAINTAINERS="naman.shenoy@oracle.com, maxbart@umich.edu"

COPY . .

RUN npm install @oracle/oraclejet-tooling 
RUN npm install -g @oracle/ojet-cli
RUN npm install express
RUN npm install

RUN ojet add sass
RUN ojet build --theme=pingpongTheme

EXPOSE 5000

CMD ["node", "index.js"]

