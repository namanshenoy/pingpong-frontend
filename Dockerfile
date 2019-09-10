FROM node
LABEL MAINTAINERS="naman.shenoy@oracle.com, maxbart@umich.edu"

COPY . .

RUN npm install @oracle/oraclejet-tooling 
RUN npm install -g @oracle/ojet-cli
RUN npm install express
RUN npm install

RUN ojet build

EXPOSE 5000

CMD ["node", "index.js"]
