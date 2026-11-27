FROM europe-north1-docker.pkg.dev/cgr-nav/pull-through/nav.no/jre:openjdk-25
ENV TZ="Europe/Oslo"
WORKDIR /app
COPY build/libs/*.jar ./
EXPOSE 8080
USER nonroot
CMD ["-jar", "app.jar"]
