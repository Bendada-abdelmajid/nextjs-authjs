import React from 'react'
import { repo } from './copy-to-clipboard'


const Guides = () => {
    return (
        <section id="guides" className="pt-20">
            <h2 className="text-xl font-medium">Get Started</h2>
            <p className="mt-3 text-zinc-600 dark:text-zinc-400">To get started with this project, follow the steps below:</p>
            <ol className="list-decimal list-inside   space-y-5 mt-6">
                <li>
                    <h4 className="inline-block">Clone the repository</h4>
                    <pre><code className="">
                        {`git clone https://github.com/iamtouha/next-lucia-auth
cd clreck-clone`}
                    </code></pre>
                </li>
                <li>
                    <h4 className="inline-block">Install dependencies</h4>
                    <pre><code className="">{`npm install`}</code></pre>
                </li>
                <li>
                    <h4 className="inline-block">
                        Set up environment variables
                    </h4>
                    <p className="mt-3 text-zinc-600 dark:text-zinc-400">
                        To configure the environment variables, create a `.env` file in
                        the root of the project and set the following variables:
                    </p>
                    <pre>
                        <code className="inline-block">
                            {`NEXTAUTH_URL= # Your NextAuth URL (e.g., http://localhost:3000)
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
AWS_S3_BUCKET_NAME= # Your S3 Bucket Name (create it in the AWS S3 Console: https://console.aws.amazon.com/s3/)`}
                        </code></pre>
                </li>
                <li className="">
                    <h4 className="inline-block">Generate Prisma client</h4>
                    <pre> <code className="">{`npx prisma generate`}</code></pre>
                </li>
                <li className="">
                    <h4 className="inline-block">run and enjoy</h4>
                    <pre> <code className="">{`npm run dev`}</code></pre>
                </li>
            </ol>
        </section>
    )
}

export default Guides