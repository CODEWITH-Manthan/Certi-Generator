# pyrefly: ignore [missing-import]
import uvicorn
import os

if __name__ == "__main__":
    env = os.getenv("ENVIRONMENT", "development")
    reload_mode = env == "development"
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=reload_mode)
