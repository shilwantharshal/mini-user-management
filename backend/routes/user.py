from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from bson.objectid import ObjectId
from datetime import datetime, timezone
import bcrypt

from backend.extensions import mongo
from backend.utils.validators import is_valid_email, is_strong_password

user_bp = Blueprint("user", __name__)

# ------------------ GET OWN PROFILE ------------------
@user_bp.route("/me", methods=["GET"])
@jwt_required()
def get_profile():
    user_id = get_jwt_identity()

    try:
        user = mongo.db.users.find_one(
            {"_id": ObjectId(user_id)},
            {"password": 0}
        )
    except Exception:
        return jsonify({"error": "Invalid user ID"}), 400

    if not user:
        return jsonify({"error": "User not found"}), 404

    user["id"] = str(user["_id"])
    user.pop("_id")

    return jsonify(user), 200


# ------------------ UPDATE PROFILE ------------------
@user_bp.route("/me", methods=["PUT"])
@jwt_required()
def update_profile():
    user_id = get_jwt_identity()
    data = request.get_json() or {}

    full_name = data.get("full_name", "").strip()
    email = data.get("email", "").lower().strip()

    if not full_name or not email:
        return jsonify({"error": "Full name and email are required"}), 400

    if not is_valid_email(email):
        return jsonify({"error": "Invalid email format"}), 400

    try:
        existing = mongo.db.users.find_one({
            "email": email,
            "_id": {"$ne": ObjectId(user_id)}
        })
    except Exception:
        return jsonify({"error": "Invalid user ID"}), 400

    if existing:
        return jsonify({"error": "Email already in use"}), 409

    mongo.db.users.update_one(
        {"_id": ObjectId(user_id)},
        {"$set": {
            "full_name": full_name,
            "email": email,
            "updated_at": datetime.now(timezone.utc)
        }}
    )

    return jsonify({"message": "Profile updated successfully"}), 200


# ------------------ CHANGE PASSWORD ------------------
@user_bp.route("/me/password", methods=["PUT"])
@jwt_required()
def change_password():
    user_id = get_jwt_identity()
    data = request.get_json() or {}

    current_password = data.get("current_password")
    new_password = data.get("new_password")
    confirm_password = data.get("confirm_password")

    # ---------- Basic validation ----------
    if not current_password or not new_password or not confirm_password:
        return jsonify({
            "error": "Current, new and confirm password are required"
        }), 400

    if new_password != confirm_password:
        return jsonify({
            "error": "New password and confirm password do not match"
        }), 400

    if not is_strong_password(new_password):
        return jsonify({
            "error": (
                "Password must be at least 8 characters long and include "
                "uppercase, lowercase, number and special character"
            )
        }), 400

    # ---------- Fetch user ----------
    try:
        user = mongo.db.users.find_one({"_id": ObjectId(user_id)})
    except Exception:
        return jsonify({"error": "Invalid user ID"}), 400

    if not user:
        return jsonify({"error": "User not found"}), 404

    # ---------- Verify current password ----------
    if not bcrypt.checkpw(
        current_password.encode("utf-8"),
        user["password"]
    ):
        return jsonify({"error": "Current password is incorrect"}), 401

    # ---------- Hash & update ----------
    new_hashed = bcrypt.hashpw(
        new_password.encode("utf-8"),
        bcrypt.gensalt()
    )

    mongo.db.users.update_one(
        {"_id": ObjectId(user_id)},
        {"$set": {
            "password": new_hashed,
            "updated_at": datetime.now(timezone.utc),
            # future-proof: revoke sessions if you track them
            # "password_changed_at": datetime.now(timezone.utc)
        }}
    )

    return jsonify({
        "message": "Password changed successfully. Please login again."
    }), 200
