from app.database import SessionLocal
from app.models.user import Role, User
from app.models.facility import JenisSarana
from app.utils.security import get_password_hash

def create_initial_data():
    db = SessionLocal()
    
    try:
        # Create roles
        roles = [
            Role(name="superadmin", description="Super Administrator dengan akses penuh"),
            Role(name="admin", description="Administrator dengan akses terbatas"),
            Role(name="uploader", description="Uploader/Faskes untuk upload claim"),
            Role(name="validator", description="Validator untuk memvalidasi claim")
        ]
        
        for role in roles:
            if not db.query(Role).filter(Role.name == role.name).first():
                db.add(role)
        
        db.commit()
        
        # Create jenis sarana
        jenis_sarana = [
            JenisSarana(id=101, code="101", name="Praktek mandiri"),
            JenisSarana(id=102, code="102", name="Puskesmas"),
            JenisSarana(id=103, code="103", name="Klinik"),
            JenisSarana(id=104, code="104", name="Rumah sakit")
        ]
        
        for js in jenis_sarana:
            if not db.query(JenisSarana).filter(JenisSarana.id == js.id).first():
                db.add(js)
        
        db.commit()
        
        # Create superadmin user
        superadmin_role = db.query(Role).filter(Role.name == "superadmin").first()
        if superadmin_role:
            superadmin = User(
                username="superadmin",
                email="superadmin@cyberclaim.com",
                full_name="Super Administrator",
                password=get_password_hash("admin123"),
                role_id=superadmin_role.id,
                is_active=True
            )
            
            if not db.query(User).filter(User.username == "superadmin").first():
                db.add(superadmin)
                db.commit()
                print("Superadmin user created: username=superadmin, password=admin123")
        
        print("Initial data created successfully!")
        
    except Exception as e:
        print(f"Error creating initial data: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    create_initial_data()