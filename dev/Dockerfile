# Development image for building and running ResearchSpace from a bind mount.
#
# Gradle 6.9.1 and the Java sources require JDK 11. Focal is used because it
# still supplies Python 2, required by node-gyp 3.x used by node-sass 4.14.1.
FROM eclipse-temurin:11-jdk-focal

ENV DEBIAN_FRONTEND=noninteractive \
    JAVA_HOME=/opt/java/openjdk \
    GRADLE_USER_HOME=/home/researchspace/.gradle \
    NODE_VERSION=12.22.12

RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        curl \
        xz-utils \
        python2 \
        build-essential \
        git \
        ca-certificates \
    && case "$(dpkg --print-architecture)" in \
         amd64) node_arch=x64 ;; \
         arm64) node_arch=arm64 ;; \
         *) echo "Unsupported architecture: $(dpkg --print-architecture)" >&2; exit 1 ;; \
       esac \
    && curl -fsSLO "https://nodejs.org/dist/v${NODE_VERSION}/node-v${NODE_VERSION}-linux-${node_arch}.tar.xz" \
    && tar -xJf "node-v${NODE_VERSION}-linux-${node_arch}.tar.xz" -C /usr/local --strip-components=1 \
    && rm "node-v${NODE_VERSION}-linux-${node_arch}.tar.xz" \
    && rm -rf /var/lib/apt/lists/* \
    && useradd --create-home --shell /bin/bash researchspace \
    && mkdir -p "${GRADLE_USER_HOME}" \
    && chown -R researchspace:researchspace /home/researchspace


# Install Node.js v14x
RUN curl -fsSL https://deb.nodesource.com/setup_14.x | bash -
RUN apt-get install -y nodejs

ENV PATH="${JAVA_HOME}/bin:${PATH}"

WORKDIR /workdir
USER researchspace

# Source is bind-mounted at runtime so edits on the host are immediately
# visible to Gradle's continuous development tasks.
CMD ["tail", "-f", "/dev/null"]