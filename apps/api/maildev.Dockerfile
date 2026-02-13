# Lightweight Maildev image for local/dev SMTP and web UI
FROM node:22-alpine
RUN npm install -g maildev@2.0.5 --omit=optional
EXPOSE 1025 1080
CMD ["maildev"]
