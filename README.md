# Studor - A Study Session / Tutor Finding Site
Studor is a website developed to help students at Texas A&M University find tutors or upcoming study sessions with students in their classes. Finding tutors or people to study with can be difficult without an established service to do so, and unfortunately, Texas A&M does not have a singular setup for this. We hope to help students by providing a platform that helps streamline this process.

## Visit our site!
[studor.app](https://www.studor.app)

## Setup
**Initial Setup**   
```
git clone https://github.com/t2minht/studor.git  
npm install   
npm run dev
```

**Environment Variables**
Copy the following into a .env.local file
```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SENDGRID_API_KEY=
```

**Dependencies**  
npm 10.4.0  
node v20.5.1

**Database**
The database is setup through Supabase. When project is set up, Supabase will provide a Supabase URL and an anon key. Store these two values in the NEXT_PUBLIC_SUPABASE_URL and  NEXT_PUBLIC_SUPABASE_ANON_KEY environment variables, respectively. This process can be aided using the following documentation from Supabase: [Supabase URL](https://supabase.com/docs/guides/api) and [Anon Key](https://supabase.com/docs/guides/api/api-keys).

**Twilio SendGrid**
Create an a Twilio SendGrid account and generate an API key. This needs to be stored in the SENDGRID_API_KEY in the .env.local file. This process can be aided using the following documentation from SendGrid: [Here](https://docs.sendgrid.com/ui/account-and-settings/api-keys)

## Credits
Developers:  
Front-end Lead - Sana Marediya
Front-end Support - Sarah Eilene Sotelo  
Back-end Lead - Shawn Mathen
Back-end Support  - Ethan Novicio 
Full-stack Support - Tuong Tran

Special Thanks to our Capstone professor, Dr. Shawna Thomas, and our class teaching assistant Yijin Fang
