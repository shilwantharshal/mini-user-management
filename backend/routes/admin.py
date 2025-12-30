from flask import Blueprint, request, jsonify
from bson.objectid import ObjectId

from backend.extensions import mongo
from backend.utils.decorators import role_required

admin_bp = Blueprint("admin", __name__)

# ------------------ GET ALL USERS (PAGINATED) ------------------
@admin_bp.route("/users", methods=["GET"])
@role_required("admin")
def get_users():
    page = request.args.get("page", 1, type=int)
    limit = 10
    skip = (page - 1) * limit

    cursor = (
        mongo.db.users
        .find({}, {"password": 0})
        .sort("created_at", -1)
        .skip(skip)
        .limit(limit)
    )

    users = [{
        "id": str(u["_id"]),
        "email": u["email"],
        "full_name": u["full_name"],
        "role": u["role"],
        "status": u["status"],
        "created_at": u.get("created_at")
    } for u in cursor]

    total_users = mongo.db.users.count_documents({})

    return jsonify({
        "users": users,
        "total": total_users,
        "current_page": page,
        "pages": (total_users + limit - 1) // limit
    }), 200


# ------------------ ACTIVATE USER ------------------
@admin_bp.route("/users/<user_id>/activate", methods=["PUT"])
@role_required("admin")
def activate_user(user_id):
    try:
        result = mongo.db.users.update_one(
            {"_id": ObjectId(user_id)},
            {"$set": {"status": "active"}}
        )
    except Exception:
        return jsonify({"error": "Invalid user ID"}), 400

    if result.matched_count == 0:
        return jsonify({"error": "User not found"}), 404

    return jsonify({"message": "User activated successfully"}), 200


# ------------------ DEACTIVATE USER ------------------
@admin_bp.route("/users/<user_id>/deactivate", methods=["PUT"])
@role_required("admin")
def deactivate_user(user_id):
    try:
        result = mongo.db.users.update_one(
            {"_id": ObjectId(user_id)},
            {"$set": {"status": "inactive"}}
        )
    except Exception:
        return jsonify({"error": "Invalid user ID"}), 400

    if result.matched_count == 0:
        return jsonify({"error": "User not found"}), 404

    return jsonify({"message": "User deactivated successfully"}), 200


# ------------------ CHANGE USER ROLE ------------------
@admin_bp.route("/users/<user_id>/role", methods=["PUT"])
@role_required("admin")
def change_user_role(user_id):
    data = request.get_json() or {}
    new_role = data.get("role")

    if new_role not in ["admin", "user"]:
        return jsonify({"error": "Invalid role"}), 400

    try:
        result = mongo.db.users.update_one(
            {"_id": ObjectId(user_id)},
            {"$set": {"role": new_role}}
        )
    except Exception:
        return jsonify({"error": "Invalid user ID"}), 400

    if result.matched_count == 0:
        return jsonify({"error": "User not found"}), 404

    return jsonify({"message": f"User role updated to {new_role}"}), 200
