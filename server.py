import sqlite3
from flask import Flask, request, jsonify, send_from_directory
import os

app = Flask(__name__, static_folder='.', static_url_path='')

DB_PATH = os.path.join(os.path.dirname(__file__), 'audit.db')

def init_db():
    conn = sqlite3.connect(DB_PATH)
    conn.execute("""
        CREATE TABLE IF NOT EXISTS feedback (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            ts DATETIME DEFAULT CURRENT_TIMESTAMP,
            item_type TEXT NOT NULL,
            item_key TEXT NOT NULL,
            helpful INTEGER NOT NULL,
            payload TEXT
        )
    """)
    conn.commit()
    conn.close()

@app.route('/')
def index():
    return send_from_directory(app.static_folder, 'index.html')

@app.route('/api/feedback', methods=['POST'])
def save_feedback():
    data = request.get_json(force=True, silent=True) or {}
    item_type = data.get('item_type')
    item_key = data.get('item_key')
    helpful = 1 if data.get('helpful') else 0
    payload = data.get('payload') or ''
    if not item_type or not item_key:
        return jsonify({'error': 'missing fields'}), 400
    conn = sqlite3.connect(DB_PATH)
    conn.execute(
        "INSERT INTO feedback (item_type, item_key, helpful, payload) VALUES (?, ?, ?, ?)",
        (item_type, item_key, helpful, payload)
    )
    conn.commit()
    conn.close()
    return jsonify({'ok': True})

@app.route('/api/feedback/summary')
def feedback_summary():
    item_type = request.args.get('item_type')
    item_key = request.args.get('item_key')
    if not item_type or not item_key:
        return jsonify({'error': 'missing query params'}), 400
    conn = sqlite3.connect(DB_PATH)
    cur = conn.cursor()
    cur.execute("SELECT SUM(helpful), COUNT(*) - SUM(helpful) FROM feedback WHERE item_type=? AND item_key=?", (item_type, item_key))
    row = cur.fetchone()
    conn.close()
    helpful = int(row[0]) if row and row[0] is not None else 0
    not_helpful = int(row[1]) if row and row[1] is not None else 0
    return jsonify({'helpful': helpful, 'notHelpful': not_helpful})

@app.route('/<path:path>')
def static_files(path):
    return send_from_directory(app.static_folder, path)

if __name__ == '__main__':
    init_db()
    app.run(host='0.0.0.0', port=8000)

