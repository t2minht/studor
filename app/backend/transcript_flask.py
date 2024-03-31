from flask import Flask, request, jsonify
from flask_cors import CORS
from pypdf import PdfReader 
import re
import os

app = Flask(__name__)
CORS(app)


def process_pdf(file_path):
    classGrades = {}
    reader = PdfReader(file_path)
    classGrades = {}

    for page in reader.pages:
        content = page.extract_text()
        rows = content.split('\n')
        for i, row in enumerate(rows):
            if re.match(r'^[A-Z]{4} \d{3}', row):
                if not re.match(r'.*\d$', row):
                    row += rows[i + 1]

                className  = row[:8]
                for j in range(len(row) - 1, 0, -1):
                    if row[j].isalpha():
                        grade = row[j]
                        break
                if grade == 'A' or grade == 'S':
                    classGrades[className] = grade
    return classGrades

    
@app.route('/upload_file', methods=['POST'])
def upload_file():
    if 'pdf' not in request.files:
        return jsonify({'error': 'No file part'}), 400
    
    pdf_file = request.files['pdf']
    
    if pdf_file.filename == '':
        return jsonify({'error': 'No selected file'}), 400
    
    pdf_file.save('uploaded_file.pdf')
    classes = process_pdf('uploaded_file.pdf')
    os.remove('uploaded_file.pdf')
    
    return classes, 200

if __name__ == '__main__':
    app.run(debug=True)

