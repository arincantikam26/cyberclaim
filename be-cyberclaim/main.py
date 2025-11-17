from fastapi import FastAPI
from app.api.v1.routes import auth, claim, sep, rm

app = FastAPI(
    title="CyberClaim API",
    version="1.0"
)

# Create tables automatically
Base.metadata.create_all(bind=engine)

app.include_router(auth.router, prefix="/api/v1/auth", tags=["Auth"])

@app.get("/")
def root():
    return {"message": "CyberClaim API Running"}
