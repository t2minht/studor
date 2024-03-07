import csv
file = open('coursecatalog\\tutorcourses.csv', 'w', newline='')
f = open('coursecatalog\ImportedCourses.csv', 'r')
f.readline()
writer = csv.writer(file)
courseDict = {}
writer.writerow(["Course Name", "Department", "CourseNum"])
for line in f:
    info = line.strip().split(",")
    courseInfo = info[0].split(' ')
    sectionInfo = courseInfo[1].split("/")
    if courseInfo[0] in courseDict.keys() and sectionInfo[0] in courseDict[courseInfo[0]] :
        continue
    courseDict.setdefault(courseInfo[0],[])
    courseDict[courseInfo[0]].append(sectionInfo[0])
    writer.writerow([info[1], courseInfo[0], sectionInfo[0]])