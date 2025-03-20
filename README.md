# Next.js Auth Starter

A simple authentication template using Next.js, Auth.js (NextAuth), and Server Actions.
##  Live Demo
https://nextjs-authjsv5.vercel.app/
## Setup

1. Clone the repository:


```bash
https://github.com/Bendada-abdelmajid/nextjs-authjs.git

```
2. Install dependencies:

```bash
npm install

```
3. Set up environment variables (`.env.local`):

```bash
DATABASE_URL=
NEXTAUTH_URL= # Your NextAuth URL (e.g., http://localhost:3000)
NEXTAUTH_SECRET= # A secret key for NextAuth encryption

AUTH_GOOGLE_ID= # Google OAuth Client ID (create it in Google Developer Console: https://console.developers.google.com/)
AUTH_GOOGLE_SECRET= # Google OAuth Secret (generated in the same place as the Client ID)

AUTH_LINKEDIN_ID= # LinkedIn OAuth Client ID (create it in LinkedIn Developer Portal: https://www.linkedin.com/developers/)
AUTH_LINKEDIN_SECRET= # LinkedIn OAuth Secret (generated in the same place as the Client ID)

EMAIL_FROM= # The email address you'll use to send verification and reset emails
EMAIL_PASSWORD= # Password or application-specific password for your email account

AWS_S3_SECRET_ACCESS_KEY= # AWS S3 Secret Access Key (generate it in the AWS IAM Console: https://console.aws.amazon.com/iam/)
AWS_S3_ACCESS_KEY_ID= # AWS S3 Access Key ID (also in IAM Console)
AWS_S3_REGION= # AWS S3 Region (e.g., us-east-1)
AWS_S3_BUCKET_NAME= # Your S3 Bucket Name (create it in the AWS S3 Console: https://console.aws.amazon.com/s3/)
```
4. Start the development server:

```bash
npx prisma generate
```
5. run and enjoy:

```bash
npm run dev
```


## 🚀 Deploy Your Own

Click the button below to deploy this template instantly on Vercel:

[![Deploy to Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Bendada-abdelmajid/nextjs-authjs&project-name=nextjs-authjs&repository-name=nextjs-authjs)

