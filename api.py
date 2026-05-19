from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import pymysql
import bcrypt
import os
import datetime

app = Flask(__name__)
CORS(app)

# =========================================================
# CONFIG
# =========================================================
UPLOAD_FOLDER = "uploads"

os.makedirs(UPLOAD_FOLDER, exist_ok=True)

app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER

# =========================================================
# DATABASE
# =========================================================
def database():
    return pymysql.connect(
        host="localhost",
        user="root",
        password="",
        database="EduNexus",
        cursorclass=pymysql.cursors.DictCursor,
        autocommit=True
    )

# =========================================================
# HELPERS
# =========================================================
def success(data=None, message="success"):
    return jsonify({
        "status": "success",
        "message": message,
        "data": data
    })

def error(message="error"):
    return jsonify({
        "status": "error",
        "message": message
    })

# =========================================================
# STATIC FILES
# =========================================================
@app.route("/uploads/<filename>")
def uploaded_file(filename):
    return send_from_directory(
        app.config["UPLOAD_FOLDER"],
        filename
    )

# =========================================================
# GET ALL
# =========================================================
def get_all(table):

    con = database()
    cur = con.cursor()

    cur.execute(f"SELECT * FROM {table}")

    data = cur.fetchall()

    cur.close()
    con.close()

    return success(data)

# =========================================================
# AUTH - SIGNUP
# =========================================================
@app.route("/api/signup", methods=["POST"])
def signup():

    try:

        d = request.json

        name = d.get("name")
        email = d.get("email")
        password = d.get("password")
        phone = d.get("phone")
        role = d.get("role")

        if not name or not email or not password:
            return error("Missing fields")

        con = database()
        cur = con.cursor()

        # prevent duplicate emails
        cur.execute(
            "SELECT * FROM users WHERE email=%s",
            (email,)
        )

        existing = cur.fetchone()

        if existing:
            cur.close()
            con.close()
            return error("Email already exists")

        hashed = bcrypt.hashpw(
            password.encode(),
            bcrypt.gensalt()
        )

        cur.execute("""
            INSERT INTO users(
                name,
                email,
                phone,
                password,
                role
            )
            VALUES(%s,%s,%s,%s,%s)
        """, (
            name,
            email,
            phone,
            hashed,
            role
        ))

        cur.close()
        con.close()

        return success(
            message="Account created"
        )

    except Exception as e:
        return error(str(e))

# =========================================================
# AUTH - SIGNIN
# =========================================================
@app.route("/api/signin", methods=["POST"])
def signin():

    try:

        d = request.json

        email = d.get("email")
        password = d.get("password")

        con = database()
        cur = con.cursor()

        cur.execute(
            "SELECT * FROM users WHERE email=%s",
            (email,)
        )

        user = cur.fetchone()

        cur.close()
        con.close()

        if not user:
            return error("Invalid email")

        stored_password = user["password"]

        if isinstance(stored_password, str):
            stored_password = stored_password.encode()

        valid = bcrypt.checkpw(
            password.encode(),
            stored_password
        )

        if not valid:
            return error("Wrong password")

        user.pop("password", None)

        return success(
            user,
            "Login successful"
        )

    except Exception as e:
        return error(str(e))

# =========================================================
# USERS
# =========================================================
@app.route("/api/users", methods=["GET"])
def users():
    return get_all("users")

@app.route("/api/users/<int:id>", methods=["DELETE"])
def delete_user(id):

    try:

        con = database()
        cur = con.cursor()

        cur.execute(
            "DELETE FROM users WHERE user_id=%s",
            (id,)
        )

        cur.close()
        con.close()

        return success(
            message="User deleted"
        )

    except Exception as e:
        return error(str(e))

# =========================================================
# SUBJECTS
# =========================================================
@app.route("/api/subjects", methods=["GET"])
def subjects():
    return get_all("subjects")

@app.route("/api/subjects", methods=["POST"])
def add_subject():

    try:

        d = request.json

        con = database()
        cur = con.cursor()

        cur.execute("""
            INSERT INTO subjects(
                subject_name,
                class_id,
                teacher_id
            )
            VALUES(%s,%s,%s)
        """, (
            d["subject_name"],
            d["class_id"],
            d["teacher_id"]
        ))

        cur.close()
        con.close()

        return success(
            message="Subject added"
        )

    except Exception as e:
        return error(str(e))

@app.route("/api/subjects/<int:id>", methods=["DELETE"])
def delete_subject(id):

    try:

        con = database()
        cur = con.cursor()

        cur.execute(
            "DELETE FROM subjects WHERE subject_id=%s",
            (id,)
        )

        cur.close()
        con.close()

        return success(
            message="Subject deleted"
        )

    except Exception as e:
        return error(str(e))

# =========================================================
# ASSIGNMENTS
# =========================================================
@app.route("/api/assignments", methods=["GET"])
def assignments():
    return get_all("assignments")

@app.route("/api/assignments", methods=["POST"])
def add_assignment():

    try:

        d = request.json

        con = database()
        cur = con.cursor()

        cur.execute("""
            INSERT INTO assignments(
                subject_id,
                teacher_id,
                title,
                description,
                due_date
            )
            VALUES(%s,%s,%s,%s,%s)
        """, (
            d["subject_id"],
            d["teacher_id"],
            d["title"],
            d["description"],
            d["due_date"]
        ))

        cur.close()
        con.close()

        return success(
            message="Assignment added"
        )

    except Exception as e:
        return error(str(e))

@app.route("/api/assignments/<int:id>", methods=["DELETE"])
def delete_assignment(id):

    try:

        con = database()
        cur = con.cursor()

        cur.execute(
            "DELETE FROM assignments WHERE assignment_id=%s",
            (id,)
        )

        cur.close()
        con.close()

        return success(
            message="Assignment deleted"
        )

    except Exception as e:
        return error(str(e))

# =========================================================
# MATERIALS
# =========================================================
@app.route("/api/materials", methods=["GET"])
def materials():
    return get_all("materials")

@app.route("/api/materials", methods=["POST"])
def add_material():

    try:

        title = request.form.get("title")
        subject_id = request.form.get("subject_id")
        uploaded_by = request.form.get("uploaded_by")

        file = request.files["file"]

        filename = (
            str(datetime.datetime.now().timestamp())
            + "_"
            + file.filename
        )

        file.save(
            os.path.join(
                app.config["UPLOAD_FOLDER"],
                filename
            )
        )

        con = database()
        cur = con.cursor()

        cur.execute("""
            INSERT INTO materials(
                subject_id,
                title,
                file_path,
                uploaded_by
            )
            VALUES(%s,%s,%s,%s)
        """, (
            subject_id,
            title,
            filename,
            uploaded_by
        ))

        cur.close()
        con.close()

        return success(
            message="Material uploaded"
        )

    except Exception as e:
        return error(str(e))

# =========================================================
# PRODUCTS
# =========================================================
@app.route("/api/products", methods=["GET"])
def products():
    return get_all("products")

@app.route("/api/products", methods=["POST"])
def add_product():

    try:

        name = request.form.get("name")
        description = request.form.get("description")
        price = request.form.get("price")
        seller_id = request.form.get("seller_id")

        photo = request.files["image"]

        filename = (
            str(datetime.datetime.now().timestamp())
            + "_"
            + photo.filename
        )

        photo.save(
            os.path.join(
                app.config["UPLOAD_FOLDER"],
                filename
            )
        )

        con = database()
        cur = con.cursor()

        cur.execute("""
            INSERT INTO products(
                name,
                description,
                price,
                seller_id,
                image
            )
            VALUES(%s,%s,%s,%s,%s)
        """, (
            name,
            description,
            price,
            seller_id,
            filename
        ))

        cur.close()
        con.close()

        return success(
            message="Product added"
        )

    except Exception as e:
        return error(str(e))

@app.route("/api/products/<int:id>", methods=["DELETE"])
def delete_product(id):

    try:

        con = database()
        cur = con.cursor()

        cur.execute(
            "DELETE FROM products WHERE product_id=%s",
            (id,)
        )

        cur.close()
        con.close()

        return success(
            message="Product deleted"
        )

    except Exception as e:
        return error(str(e))

# =========================================================
# ORDERS
# =========================================================
@app.route("/api/orders", methods=["POST"])
def create_order():

    try:

        d = request.json

        product_id = d["product_id"]
        buyer_id = d["buyer_id"]
        quantity = int(d["quantity"])

        con = database()
        cur = con.cursor()

        cur.execute("""
            SELECT * FROM products
            WHERE product_id=%s
        """, (
            product_id,
        ))

        product = cur.fetchone()

        if not product:
            return error("Product not found")

        total = (
            float(product["price"])
            * quantity
        )

        cur.execute("""
            INSERT INTO orders(
                product_id,
                buyer_id,
                quantity,
                total_price,
                order_status
            )
            VALUES(%s,%s,%s,%s,%s)
        """, (
            product_id,
            buyer_id,
            quantity,
            total,
            "Pending"
        ))

        cur.close()
        con.close()

        return success({
            "total": total
        }, "Order placed")

    except Exception as e:
        return error(str(e))

@app.route("/api/orders", methods=["GET"])
def orders():
    return get_all("orders")

# =========================================================
# CHAT
# =========================================================
@app.route("/api/chat/send", methods=["POST"])
def send_chat():

    try:

        d = request.json

        con = database()
        cur = con.cursor()

        cur.execute("""
            INSERT INTO chats(
                sender_id,
                receiver_id,
                message
            )
            VALUES(%s,%s,%s)
        """, (
            d["sender_id"],
            d["receiver_id"],
            d["message"]
        ))

        cur.close()
        con.close()

        return success(
            message="Message sent"
        )

    except Exception as e:
        return error(str(e))

@app.route("/api/chat/<int:u1>/<int:u2>", methods=["GET"])
def get_chat(u1, u2):

    con = database()
    cur = con.cursor()

    cur.execute("""
        SELECT * FROM chats
        WHERE (
            sender_id=%s
            AND receiver_id=%s
        )
        OR (
            sender_id=%s
            AND receiver_id=%s
        )
        ORDER BY id ASC
    """, (
        u1,
        u2,
        u2,
        u1
    ))

    data = cur.fetchall()

    cur.close()
    con.close()

    return success(data)

# =========================================================
# NOTIFICATIONS
# =========================================================
@app.route("/api/notifications", methods=["GET"])
def notifications():
    return get_all("notifications")

@app.route("/api/notifications", methods=["POST"])
def add_notification():

    try:

        d = request.json

        con = database()
        cur = con.cursor()

        cur.execute("""
            INSERT INTO notifications(
                user_id,
                message
            )
            VALUES(%s,%s)
        """, (
            d["user_id"],
            d["message"]
        ))

        cur.close()
        con.close()

        return success(
            message="Notification sent"
        )

    except Exception as e:
        return error(str(e))

# =========================================================
# ATTENDANCE
# =========================================================
@app.route("/api/attendance", methods=["GET"])
def attendance():
    return get_all("attendance")

@app.route("/api/attendance", methods=["POST"])
def add_attendance():

    try:

        d = request.json

        con = database()
        cur = con.cursor()

        cur.execute("""
            INSERT INTO attendance(
                student_id,
                subject_id,
                status,
                date
            )
            VALUES(%s,%s,%s,NOW())
        """, (
            d["student_id"],
            d["subject_id"],
            d["status"]
        ))

        cur.close()
        con.close()

        return success(
            message="Attendance saved"
        )

    except Exception as e:
        return error(str(e))

# =========================================================
# GRADES
# =========================================================
@app.route("/api/grades", methods=["GET"])
def grades():
    return get_all("grades")

@app.route("/api/grades", methods=["POST"])
def add_grade():

    try:

        d = request.json

        con = database()
        cur = con.cursor()

        cur.execute("""
            INSERT INTO grades(
                student_id,
                assignment_id,
                marks,
                feedback
            )
            VALUES(%s,%s,%s,%s)
        """, (
            d["student_id"],
            d["assignment_id"],
            d["marks"],
            d["feedback"]
        ))

        cur.close()
        con.close()

        return success(
            message="Grade added"
        )

    except Exception as e:
        return error(str(e))

# =========================================================
# RUN
# =========================================================
if __name__ == "__main__":
    app.run(
        debug=True,
        host="0.0.0.0",
        port=5000
    )