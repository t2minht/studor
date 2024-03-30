from pypdf import PdfReader 
import re

reader = PdfReader('test2.pdf')

# print(len(reader.pages))
# page = reader.pages[0] 
# print(page.extract_text())

classGrades = {}

for page in reader.pages:
    count = 0
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
            

print(len(classGrades.items()))
