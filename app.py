from flask import Flask, request, jsonify
import sqlite3

app = Flask(__name__)

def init_db():
    conn = sqlite3.connect('database.db')
    cursor = conn.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS messages (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nama TEXT NOT NULL,
            email TEXT NOT NULL,
            pesan TEXT NOT NULL
        )
    ''')
    conn.commit()
    conn.close()

init_db()

@app.route('/submit-pesan', methods=['POST'])
def submit_pesan():
    data = request.json
    nama = data.get('nama')
    email = data.get('email')
    pesan = data.get('pesan')

    if not nama or not email or not pesan:
        return jsonify({"status": "error", "message": "Data tidak lengkap!"}), 400

    try:
        conn = sqlite3.connect('database.db')
        cursor = conn.cursor()
        
        cursor.execute("INSERT INTO messages (nama, email, pesan) VALUES (?, ?, ?)", (nama, email, pesan))
        
        conn.commit()
        conn.close()
        
        return jsonify({"status": "success", "message": "Pesan berhasil disimpan!"}), 200
        
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)