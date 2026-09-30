from backend.db.session import SessionLocal, engine
from backend.models.domain import Base, User
from backend.core.security import get_password_hash

def seed_db():
    print("Creating DB tables...")
    Base.metadata.create_all(bind=engine)
    
    db = SessionLocal()
    print("Checking for existing users...")
    if db.query(User).first() is None:
        print("Seeding users...")
        users = [
            User(email="admin@meghanvaya.in", hashed_password=get_password_hash("demo123"), full_name="Admin User", role="ADMIN"),
            User(email="analyst@meghanvaya.in", hashed_password=get_password_hash("demo123"), full_name="Meteorologist", role="METEOROLOGIST"),
            User(email="officer@meghanvaya.in", hashed_password=get_password_hash("demo123"), full_name="Govt Officer", role="GOVT_OFFICER"),
            User(email="user@meghanvaya.in", hashed_password=get_password_hash("demo123"), full_name="General User", role="GENERAL_USER")
        ]
        db.add_all(users)
        db.commit()
        print("Demo users seeded successfully.")
    else:
        print("Users already exist, skipping seed.")
    db.close()

if __name__ == "__main__":
    seed_db()
