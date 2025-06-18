import os
from dotenv import load_dotenv

def load_config():
    load_dotenv()
    return {
        'openai_api_key': os.getenv("OPENAI_API_KEY")
    }

class Config:
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL')
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    JWT_SECRET_KEY = os.environ.get('JWT_SECRET_KEY') or 'votre_clé_secrète_jwt' # Fournissez une valeur par défaut SECURE en production

    def __init__(self):
        # Validate that we have a database URL
        if not self.SQLALCHEMY_DATABASE_URI:
            raise ValueError("DATABASE_URL environment variable is not set or is empty")