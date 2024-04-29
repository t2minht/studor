# Studor - A Study Session / Tutor Finding Site

Studor is a website developed to help students at Texas A&M University find tutors or upcoming study sessions with students in their classes. Finding tutors or people to study with can be difficult without an established service to do so, and unfortunately, Texas A&M does not have a singular setup for this. We hope to help students by providing a platform that helps streamline this process.

## Visit our site: [studor.app](https://www.studor.app)

## Setup

**Initial Setup**

```
git clone https://github.com/t2minht/studor.git  
npm install   
npm run dev
```

**Environment Variables**  
Copy the following into a .env.local file in the project's root directory

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SENDGRID_API_KEY=
```

**Dependencies/Versions**  
npm 10.4.0  
node v20.5.1

**Database**  
The database is set up through Supabase. When the project is set up, Supabase will provide a Supabase URL and an anon key. Store these two values in the NEXT_PUBLIC_SUPABASE_URL and  NEXT_PUBLIC_SUPABASE_ANON_KEY environment variables, respectively. This process can be aided using the following documentation from Supabase: [Supabase URL](https://supabase.com/docs/guides/api) and [Anon Key](https://supabase.com/docs/guides/api/api-keys).

**Twilio SendGrid**  
Create a Twilio SendGrid account and generate an API key. This needs to be stored in the SENDGRID_API_KEY in the .env.local file. This process can be aided using the following documentation from [SendGrid](https://docs.sendgrid.com/ui/account-and-settings/api-keys).

**Website Hosting**  
The website is hosted on Vercel, due to its compatibility with Next.js. After setting up the project and env variables, create a Vercel account and create a new project. Next, add your GitHub link and upload your .env file. You will also need to change the Build Command to the following:

```
npm run build
```

**Transcript Parsing**  
This is done in Python, which can be seen at the following GitHub link: [https://github.com/smmathen/studor-transcript](https://github.com/smmathen/studor-transcript).  
  To run locally, run the following commands in the terminal:

```
git clone https://github.com/smmathen/studor-transcript.git
pip3 install -r requirements.txt
python3 transcript_flask.py
```

Alternatively, the endpoint is publicly hosted on Pythonanwhere, providing the following endpoint that can be hit:
[https://smmathen.pythonanywhere.com/upload_file](https://smmathen.pythonanywhere.com/upload_file).  
- This is a POST endpoint that receives the transcript and the name of the student.
- The endpoint first checks if a PDF and name are both received
If so, the transcript is parsed via the pypdf Python package, checking validity of the transcript.
- If the transcript is valid, every line is parsed for the class and the grade. If the grade is an A or an S, the class is then stored in a dictionary.
This dictionary is returned to the caller, which can be used as needed

## Credits

### Developers:  
Front-end Lead - Sana Marediya  
Front-end Support - Sarah Eilene Sotelo  
Back-end Lead - Shawn Mathen  
Back-end Support  - Ethan Novicio  
Full-stack Support - Tuong Tran

Special Thanks to our Capstone professor, Dr. Shawna Thomas, and our class teaching assistant Yijin Fang
