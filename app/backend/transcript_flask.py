from flask import Flask, request, jsonify
from flask_cors import CORS
from pypdf import PdfReader
import re
import os

app = Flask(__name__)
CORS(app)

# Function to process the PDF file and extract the class grades
def process_pdf(file_path, first_name):
    classGrades = {}
    reader = PdfReader(file_path)

    for page in reader.pages:
        content = page.extract_text()
        rows = content.split('\n')
        for i, row in enumerate(rows):
            if i == 0:
                # First checks if the university is Texas A&M University
                if row != 'TEXAS A&M UNIVERSITY':
                    print('Invalid transcript: wrong university')
                    return 'Invalid transcript: wrong university'
            if i == 1:
                # Then checks if the location is College Station, Texas 77843
                if row != 'College Station, Texas 77843':
                    print('Invalid transcript: wrong location')
                    return 'Invalid transcript: wrong location'
            if i == 3:
                words = row.split()
                first_name_transcript = words[1]
                # Checks if name matches what is coming from the account
                if first_name != first_name_transcript:
                    print('Invalid transcript: wrong first name')
                    return 'Invalid transcript: wrong first name'
                uin_split = row.split('(')[1][:9]
                double_zeros = uin_split[3:5]
                if double_zeros != '00':
                    print('Invalid transcript: invalid UIN')
                    return 'Invalid transcript: invalid UIN'
            # Parses the class grades for any that are an 'A' or 'S'
            if re.match(r'^[A-Z]{4} \d{3}', row):
                if not re.match(r'.*\d$', row):
                    row += rows[i + 1]

                className = row[:8]
                for j in range(len(row) - 1, 0, -1):
                    if row[j].isalpha():
                        grade = row[j]
                        break
                if grade == 'A' or grade == 'S':
                    classGrades[className] = grade
    print(first_name, '- valid transcript')
    print(classGrades)
    return classGrades

# Test endpoint to check if the server is running
@app.route('/api', methods=['GET'])
def index():
    return 'Hello, World!'


# Endpoint that can receive a PDF file and a student's name for tutor verification
@app.route('/upload_file', methods=['POST'])
def upload_file():
    print(request.files)
    if 'pdf' not in request.files:
        return jsonify({'error': 'No file part'}), 400

    pdf_file = request.files['pdf']
    first_name = request.form['user_name']

    if pdf_file.filename == '':
        return jsonify({'error': 'No selected file'}), 400

    pdf_file.save('uploaded_file.pdf')
    classes = process_pdf('uploaded_file.pdf', first_name)
    os.remove('uploaded_file.pdf')

    if isinstance(classes, str) and classes[:7] == 'Invalid':
        return jsonify({'error': 'Invalid transcript', 'message': classes}), 400

    return classes, 200


if __name__ == '__main__':
    app.run(debug=True, port=5000)
