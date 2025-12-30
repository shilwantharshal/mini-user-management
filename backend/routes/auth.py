from flask import Blueprint, request, jsonify
from flask_jwt_extended import (
    create_access_token,
    jwt_required,
    get_jwt_identity
)
from datetime import datetime
from bson.objectid import ObjectId
import bcrypt

from backend.extensions import mongo
from backend.utils.validators import is_valid_email, is_strong_password


auth_bp = Blueprint("auth", __name__)

# ------------------ SIGNUP ------------------
@auth_bp.route("/signup", methods=["POST"])
def signup():
    data = request.get_json() or {}

    email = data.get("email", "").lower().strip()
    password = data.get("password")
    full_name = data.get("full_name")

    if not all([email, password, full_name]):
        return jsonify({"error": "All fields are required"}), 400

    if not is_valid_email(email):
        return jsonify({"error": "Invalid email format"}), 400

    if not is_strong_password(password):
        return jsonify({
            "error": "Password must be at least 8 chars and include upper, lower, number, special char"
        }), 400

    if mongo.db.users.find_one({"email": email}):
        return jsonify({"error": "Email already exists"}), 409

    hashed = bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt())

    user = {
        "email": email,
        "password": hashed,
        "full_name": full_name,
        "role": "user",
        "status": "active",
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow(),
        "last_login": None
    }

    result = mongo.db.users.insert_one(user)

    token = create_access_token(identity=str(result.inserted_id))

    return jsonify({
        "message": "Signup successful",
        "access_token": token
    }), 201


# ------------------ LOGIN ------------------
@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json() or {}

    email = data.get("email", "").lower().strip()
    password = data.get("password")

    if not email or not password:
        return jsonify({"error": "Email and password are required"}), 400

    user = mongo.db.users.find_one({"email": email})

    if not user or not bcrypt.checkpw(password.encode("utf-8"), user["password"]):
        return jsonify({"error": "Invalid credentials"}), 401

    if user.get("status") != "active":
        return jsonify({"error": "Account is inactive"}), 403

    mongo.db.users.update_one(
        {"_id": user["_id"]},
        {"$set": {
            "last_login": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        }}
    )

    token = create_access_token(identity=str(user["_id"]))

    return jsonify({
        "message": "Login successful",
        "access_token": token
    }), 200


# ------------------ CURRENT USER ------------------
@auth_bp.route("/me", methods=["GET"])
@jwt_required()
def me():
    user_id = get_jwt_identity()

    try:
        user = mongo.db.users.find_one({"_id": ObjectId(user_id)})
    except Exception:
        return jsonify({"error": "Invalid user ID"}), 400

    if not user:
        return jsonify({"error": "User not found"}), 404

    return jsonify({
        "id": str(user["_id"]),
        "email": user["email"],
        "full_name": user["full_name"],
        "role": user["role"],
        "status": user["status"],
        "last_login": user.get("last_login")
    }), 200


# ------------------ LOGOUT ------------------
@auth_bp.route("/logout", methods=["POST"])
@jwt_required()
def logout():
    # JWT is stateless; frontend deletes token
    return jsonify({"message": "Logout successful"}), 200
