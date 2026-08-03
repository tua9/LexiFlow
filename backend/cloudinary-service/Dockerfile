FROM gradle:9.5.0-jdk21 AS builder

WORKDIR /app

COPY . .

RUN gradle bootJar -x test --no-daemon

FROM eclipse-temurin:21-jdk

WORKDIR /app

COPY --from=builder /app/build/libs/*.jar app.jar

EXPOSE 1003

ENTRYPOINT ["java","-jar","app.jar"]