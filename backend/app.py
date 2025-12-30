import os
from flask import Flask, jsonify
from flask_cors import CORS
from dotenv import load_dotenv

from backend.extensions import mongo, jwt
from backend.routes.auth import auth_bp
from backend.routes.user import user_bp
from backend.routes.admin import admin_bp

load_dotenv()

def create_app():
    app = Flask(__name__)

    app.config["MONGO_URI"] = os.getenv("MONGO_URI")
    app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY")

    if not app.config["MONGO_URI"]:
        raise RuntimeError("MONGO_URI not set")

    if not app.config["JWT_SECRET_KEY"]:
        raise RuntimeError("JWT_SECRET_KEY not set")

    CORS(app)
    mongo.init_app(app)
    jwt.init_app(app)

    app.register_blueprint(auth_bp, url_prefix="/auth")
    app.register_blueprint(user_bp, url_prefix="/users")
    app.register_blueprint(admin_bp, url_prefix="/admin")

    @app.route("/", methods=["GET"])
    def health():
        return jsonify({"status": "API running"}), 200
    print("mongo.db =", mongo.db)
    return app


app = create_app()

# ✅ THIS PART WAS MISSING
if __name__ == "__main__":
    app.run(host="127.0.0.1", port=5000, debug=True)
