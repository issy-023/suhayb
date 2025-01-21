# Deployment Guide

## Prerequisites
Ensure you already have:
1. A `Dockerfile` and `docker-compose.yml` ready.
2. An account on DigitalOcean and Cloudflare.
3. A registered domain.

---

## Step 1: Configure Your Domain on Resend
1. Go to [resend.com](https://resend.com) and log in.
2. Navigate to **Domains** and click on **Add Domain**.
3. Enter your custom domain name and region.
4. Resend will provide DNS records you need to add to your domain registrar.

### Step 2: Set Up DNS Records on Cloudflare
1. Log in to Cloudflare.
2. Go to **DNS** > **Records**.
3. Add the following records:
    - **Type:** A, **Name:** `@`, **Value:** Provided by Resend, **TTL:** Auto, **Priority:** 10.
    - Repeat for the remaining records as instructed by Resend.
4. (Optional) Add the security record suggested by Resend for increased security.
5. Verify the records are correctly added.

---

## Step 3: Create a VPS on DigitalOcean
1. Log in to your DigitalOcean account.
2. Go to **Droplets** and create a new droplet.
3. Select **Docker on Ubuntu** as the image.
4. Choose server specs:
    - Basic plan (~ $6/month).
    - Adjust if you need more storage or CPU power.
5. Under **Authentication Method**, select **SSH Key**.
    - If you don’t have an SSH key, generate one:
      ```bash
      cd ~/.ssh
      ssh-keygen -t rsa -b 4096 -C "your_email@example.com"
      ```
        - Save the key as `mern-droplet` (or another name).
        - Keep the passphrase empty.
        - Verify the files with `ls -a`.
    - Copy the public key:
      ```bash
      cat ~/.ssh/mern-droplet.pub
      ```
        - Paste it into the **SSH Key Content** field on DigitalOcean.
        - Give it a name, e.g., `mern-key`, and click **Add SSH Key**.
6. Scroll down to **Finalize Details**:
    - Name the droplet, e.g., `mern-demo`.
    - Click **Create Droplet**.

---

## Step 4: Update DNS Records
1. Once the droplet is created, copy its IP address.
2. Go to Cloudflare and add the following records:
    - **Type:** A, **Name:** `@`, **Value:** IP address, **Proxy Status:** Off.
    - **Type:** A, **Name:** `api`, **Value:** IP address, **Proxy Status:** Off.
    - **Type:** CNAME, **Name:** `www`, **Content:** `@`.
3. Save the records.

---

## Step 5: Secure the Server with a Firewall
1. In DigitalOcean, go to **Networking** > **Firewalls**.
2. Click **Create a New Firewall**.
3. Configure **Inbound Rules**:
    - **Type:** SSH, **Port:** 22, **Sources:** All IPv4 and IPv6.
    - **Type:** HTTP, **Port:** 80, **Sources:** All IPv4 and IPv6.
    - **Type:** HTTPS, **Port:** 443, **Sources:** All IPv4 and IPv6.
4. Leave **Outbound Rules** as default.
5. Under **Apply to Droplets**, select your droplet (e.g., `mern-demo`).
6. Click **Create Firewall**.

---

## Step 6: Connect to the Server via SSH
1. Open your terminal and type:
   ```bash
   ssh -i ~/.ssh/mern-droplet root@<IP_ADDRESS>
   ```
    - Replace `<IP_ADDRESS>` with your droplet’s IP.
2. When prompted, type `yes` to continue.
3. Once connected, update the server:
   ```bash
   apt-get update
   ```
4. Check installed versions:
    - Git:
      ```bash
      git --version
      ```
    - Docker:
      ```bash
      docker -v
      ```

---

## Step 7: Clone the Repository
1. Create directories for your project:
   ```bash
   mkdir -p /var/www
   cd /var/www
   ```
2. Clone your repository:
   ```bash
   git clone <REPOSITORY_URL>
   ```
    - Replace `<REPOSITORY_URL>` with the HTTPS URL of your GitLab repo.
3. Change into your project directory:
   ```bash
   cd <PROJECT_NAME>
   ```
    - Replace `<PROJECT_NAME>` with the name of your project.
4. Verify the branch:
   ```bash
   git branch
   ```

---

## Step 8: Set Up Environment Variables
1. Update the domain name in your `.env` file:
    - Exit the editor after changes:
      ```
      ESC + :wq
      ```
2. Navigate to the backend directory:
   ```bash
   cd backend
   ```
3. Copy the sample `.env` file:
   ```bash
   cp sample.env .env
   ```
4. Open the `.env` file:
   ```bash
   vim .env
   ```
5. Generate secure keys for JWT:
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```
    - Copy the output and update:
        - `JWT_SECRET=`
        - `JWT_REFRESH_SECRET=`
6. Update these variables:
   ```
   NODE_ENV=production
   APP_ORIGIN=https://<your custom domain>
   MONGO_URI=mongodb://mongo:27017/autodb
   JWT_SECRET=<Generated Key>
   JWT_REFRESH_SECRET=<Generated Key>
   EMAIL_SENDER=no-reply@<your domain>
   RESEND_API_KEY=<API Key from Resend>
   ```
7. Save and exit the file:
   ```
   ESC + :wq
   ```

---

## Step 9: Verify and Run the Application
1. Go back to the root directory:
   ```bash
   cd ..
   ```
2. Ensure the `docker-compose.yml` file is present:
   ```bash
   ls
   ```
3. Start the containers:
   ```bash
   docker compose up -d
   ```
4. Rebuild the containers (if needed):
   ```bash
   docker compose up -d --build
   ```
5. Verify the running containers:
   ```bash
   docker ps
   ```

---

## Final Step
Your application is now running on the internet! Test it using your domain to ensure everything works as expected.
