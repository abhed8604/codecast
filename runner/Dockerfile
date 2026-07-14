FROM debian:bookworm-slim
RUN apt-get update && apt-get install -y --no-install-recommends \
    python3 \
    g++ \
    sqlite3 \
    && rm -rf /var/lib/apt/lists/*
WORKDIR /sandbox
CMD ["tail", "-f", "/dev/null"]
