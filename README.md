# board-test-project

 SBOM 생성을 위한 테스트 프로젝트입니다.

# Dockerfile 작성

## Docker 이미지 빌드
- `docker build -t my-react-app .`
## Docker 이미지 실행 (선택사항)
- `docker run -p 3000:3000 my-react-app`

# Docker 이미지에서 SBOM 생성
## Syft 설치
- `brew install syft`
## Docker 이미지에서 SBOM 생성
- `syft my-react-app -o cyclonedx-json > sbom.json`
## SBOM 업로드 분석
- 업로드 분석 버튼 누르고 해당 sbom.json 업로드

위 과정을 통해 취약점 분석이 가능합니다.

샘플 Dockerfile 예제

```

# Step 1: Use an official Node.js image as the base image
FROM node:18-alpine

# Step 2: Set the working directory inside the container
WORKDIR /app

# Step 3: Copy package.json and package-lock.json (or yarn.lock)
COPY package*.json ./

# Step 4: Install dependencies
RUN yarn

# Step 5: Copy the rest of the application code
COPY . .

# Step 6: Build the project (for Next.js, you can also use `next build`)
RUN yarn build

# Step 7: Expose the port that the app will run on (e.g., 3000 for React)
EXPOSE 3000

# Step 8: Run the app
CMD ["yarn", "start"]

```













