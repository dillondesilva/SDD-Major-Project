FROM node:buster
RUN mkdir /usr/local/app
COPY sdd-major-app /usr/local/app
WORKDIR /usr/local/app/
RUN npm install
RUN npm run build

FROM python
RUN mkdir /usr/local/app
COPY sdd-major-server /usr/local/app
COPY --from=0 /usr/local/app/build /usr/local/app/client
WORKDIR /usr/local/app/
RUN pip install -r requirements.txt

ENTRYPOINT [ "python", "server.py"]