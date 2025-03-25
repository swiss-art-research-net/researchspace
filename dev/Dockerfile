FROM ubuntu:22.04

# Set up working directory
WORKDIR /workdir

# Install dependencies
RUN apt update 
RUN apt install -y \
    curl wget unzip dirmngr apt-transport-https lsb-release ca-certificates \
    openjdk-21-jdk python2 \
    && rm -rf /var/lib/apt/lists/*

# Install Node.js
RUN curl -sL https://deb.nodesource.com/setup_22.x | bash - \
    && apt install -y nodejs \
    && rm -rf /var/lib/apt/lists/*

# Default command
CMD ["tail", "-f", "/dev/null"]