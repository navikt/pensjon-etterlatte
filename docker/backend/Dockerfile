FROM gcr.io/distroless/java25-debian13
ENV TZ="Europe/Oslo"
WORKDIR /app
COPY build/libs/*.jar ./
EXPOSE 8080
USER nonroot
CMD ["app.jar"]