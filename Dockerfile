# Use a multi-arch compatible base image
FROM eclipse-temurin:11 AS builder

# Set environment variables for Gradle and Java
ENV GRADLE_VERSION=8.11.1
ENV GRADLE_HOME=/opt/gradle
ENV PATH="$GRADLE_HOME/bin:$PATH"

# Install necessary dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    ca-certificates \
    unzip \
    build-essential \
  && rm -rf /var/lib/apt/lists/*

# Install Gradle
RUN curl -fsSL "https://services.gradle.org/distributions/gradle-${GRADLE_VERSION}-bin.zip" -o /tmp/gradle.zip \
  && unzip -d /opt/gradle /tmp/gradle.zip \
  && ln -s /opt/gradle/gradle-${GRADLE_VERSION} /opt/gradle/latest \
  && rm /tmp/gradle.zip

# Install Node.js (adjust to LTS version)
RUN curl -fsSL https://deb.nodesource.com/setup_22.x | bash - \
  && apt-get install -y --no-install-recommends nodejs \
  && rm -rf /var/lib/apt/lists/*

# Copy application source
WORKDIR /workdir
ADD . /workdir

# Build the application
RUN ./gradlew clean war

# Move the artifact to the target directory
RUN mv build/libs/ROOT-*.war /workdir/dist/docker/platform/ROOT.war

# Build image
FROM jetty:9.4.27-jre11

LABEL maintainer="Swiss Art Research Infrastructure"

USER root

# install additional packages
# RUN apk --update add vim && rm -rf /var/cache/apk/*

# for backward compatibility change uid and guid to the one that was in the alpine based image
# by default on debian id 100 is reserved by _apt user
# WARNING, it can have consequences on the work of apt,apt-get.
RUN usermod -u 1100 _apt
RUN usermod -u 100 jetty
RUN groupmod -g 101 jetty

# add user jetty to group root which is used for most of the permissions
# user jetty has uid 100
# group root has gid 0
RUN addgroup jetty root

# make group 'root' (no special permissions!) owning group of the various jetty base, home, and temp folders
# to allow the container to be run by non-root and non-jetty users as well (this is required e.g. for OpenShift)
# also set same permissions as for owner
RUN echo "fixing group ownership for Jetty base, home, and temp folders" \
    && umask 0002 \
    && chgrp -R 0 "$TMPDIR" \
    && chmod -R g=u "$TMPDIR" \
    && chmod -R g+s "$TMPDIR" \
    && chgrp -R 0 "$JETTY_BASE" \
    && chmod -R g=u "$JETTY_BASE" \
    && chmod -R g+s "$JETTY_BASE" \
    && chgrp -R 0 "$JETTY_HOME"\
    && chmod -R g=u "$JETTY_HOME" \
    && chmod -R g+s "$JETTY_HOME"


COPY --chown=100:0 dist/docker/platform/entrypoint.sh /
RUN chmod a+x /entrypoint.sh

# Custom apps can be mounted under /apps folder
RUN echo "setting up platform, apps, and runtime folders" \
    && umask 0002 \
    && mkdir /firstStart \
    && chown -R 100:0 "/firstStart" \
    && chmod -R g=u "/firstStart" \
    && chmod -R g+ws "/firstStart" \
    && mkdir /apps \
    && chown -R 100:0 "/apps" \
    && chmod -R g=u "/apps" \
    && chmod -R g+ws "/apps" \
    && mkdir /runtime-data \
    && mkdir -p /runtime-data/config/repositories \
    && mkdir -p /runtime-data/data/repositories \
    && chown -R 100:0 "/runtime-data" \
    && chmod -R g=u "/runtime-data" \
    && chmod -R g+ws "/runtime-data" \
    && mkdir /var/lib/jetty/logs \
    && chown -R 100:0 "/var/lib/jetty/logs" \
    && chmod -R g=u "/var/lib/jetty/logs" \
    && chmod -R g+ws "/var/lib/jetty/logs"

COPY --chown=100:0 dist/docker/platform/jetty-logging.properties /var/lib/jetty/resources/jetty-logging.properties

COPY --chown=100:0 dist/docker/platform/shiro-tools-hasher-2.0.2-cli.jar /firstStart/
COPY --chown=100:0 dist/docker/platform/first-passwd-init.sh /firstStart/

COPY --chown=100:0 dist/docker/platform/ROOT.xml /var/lib/jetty/webapps/ROOT.xml

# Copy WAR file from build stage
COPY --chown=100:0 --from=builder /workdir/dist/docker/platform/ROOT.war /var/lib/jetty/webapps/ROOT.war

RUN mkdir -p /runtime-data/config
COPY --chown=100:0 src/main/resources/org/researchspace/apps/default/config/shiro.ini /runtime-data/config/shiro.ini

# one final, recursive change of permissions in /runtime-data
RUN chmod g+w "/var/lib/jetty/webapps/ROOT.xml" \
    && chown -R 100:0 "/runtime-data" \
    && chmod -R g=u "/runtime-data" \
    && chmod -R g+ws "/runtime-data"

USER jetty

# enable jetty logging configuration module
RUN java -jar "$JETTY_HOME/start.jar" --add-to-start="logging-jetty"

ENV PLATFORM_OPTS=
ENV RUNTIME_OPTS="-DruntimeDirectory=/runtime-data -Dorg.researchspace.config.baselocation=/runtime-data/config -DappsDirectory=/apps -Dconfig.environment.shiroConfig=/runtime-data/config/shiro.ini -Dlog4j.configurationFile=classpath:org/researchspace/logging/log4j2.xml -Dorg.eclipse.jetty.server.Request.maxFormContentSize=104857600"

ENTRYPOINT ["/entrypoint.sh"]

VOLUME /runtime-data
# note: if /apps is also required as volume, it can be mounted as such from the docker-compose file