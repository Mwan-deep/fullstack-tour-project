# Stage 1: Môi trường Maven để Build code
FROM maven:3.9.6-eclipse-temurin-21 AS build
WORKDIR /app
# Copy file cấu hình thư viện vào trước
COPY pom.xml .
# Copy toàn bộ thư mục source code vào
COPY src ./src
# Build ra file .jar và bỏ qua bước chạy test để tăng tốc độ
RUN mvn clean package -DskipTests

# Stage 2: Môi trường Java JRE để chạy App (Rất nhẹ)
FROM eclipse-temurin:21-jre
WORKDIR /app
# Copy cái file .jar vừa được đóng gói ở Stage 1 sang đây
COPY --from=build /app/target/*.jar app.jar
# Mở cổng 8080 cho Internet truy cập
EXPOSE 8080
# Lệnh để khởi động server Spring Boot
ENTRYPOINT ["java", "-jar", "app.jar"]