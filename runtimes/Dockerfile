FROM node:22


RUN apt-get update && apt-get install -y git && rm -rf /var/lib/apt/lists/*


COPY main.sh /builder/main.sh
RUN chmod +x /builder/main.sh

WORKDIR /app