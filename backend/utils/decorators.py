from functools import wraps
from flask import jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from bson.objectid import ObjectId

from backend.extensions import mongo


def role_required(*allowed_roles):
    def decorator(fn):
        @wraps(fn)
        @jwt_required()
        def wrapper(*args, **kwargs):
            user_id = get_jwt_identity()

            try:
                user = mongo.db.users.find_one({"_id": ObjectId(user_id)})
            except Exception:
                return jsonify({"error": "Invalid user ID"}), 401

            if not user:
                return jsonify({"error": "User not found"}), 404

            if user.get("status") != "active":
                return jsonify({"error": "Account inactive"}), 403

            if user.get("role") not in allowed_roles:
                return jsonify({"error": "Insufficient permissions"}), 403

            return fn(*args, **kwargs)

        return wrapper
    return decorator
