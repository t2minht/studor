import csv
file = open('coursecatalog\coursecatalog.csv', 'w', newline='')
f = open('coursecatalog\ImportedCourses.csv', 'r')
f.readline()
writer = csv.writer(file)
writer.writerow(["Course Name", "Department", "CourseNum", "SectionNum", "Days", "StartTime", "EndTime", "Asynch"])
for line in f:
    info = line.strip().split(",")
    courseInfo = info[0].split(' ')
    if(courseInfo[2] == "EXAM"):
        continue
    sectionInfo = courseInfo[1].split("/")
    # print(line)
    # print([courseInfo[0], sectionInfo[0], sectionInfo[1]])
    asynch = info[2] == "" and info[3] == "" and info[4] == ""
    writer.writerow([info[1], courseInfo[0], sectionInfo[0], sectionInfo[1],info[2], info[3], info[4], asynch])