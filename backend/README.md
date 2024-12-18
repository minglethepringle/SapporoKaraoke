# Installation

1. Install MPV: https://mpv.io/installation/ . Cut-paste folder into Program Files and add to PATH.
2. Install ffmpeg: https://www.wikihow.com/Install-FFmpeg-on-Windows . Cut-paste folder into Program Files and add to PATH.
3. `npm install node-mpv@beta express cors openssl liquidjs puppeteer moment youtube-dl-exec`

# Usage

1. Set up config.js. Probably want to set TEST_MODE and LOG_MODE to false. Specify save directory!
2. Background videos are in `media/bg` and selected randomly
2. Enable No-IP DDNS
3. `node index.js`
4. Check if the terminal stays open and says "Server is running on port 5000". If it doesn't, relaunch program.

# SSL
This server uses a LetsEncrypt SSL certificate. Follow the instructions here: https://certbot.eff.org/instructions?ws=other&os=windows

First-time installation of SSL certificate
1. Make sure No-IP DUC is up and running, with a port forward of outside port 51581 to this computer port 5000 (for karaoke server)
2. Make sure there's a port forward of outside port 80 to this computer port 80 (for LetsEncrypt)
1. Download and install certbot
2. Open a cmd prompt with admin privileges
3. Navigate to this project's ssl folder and run `certbot certonly --standalone`
4. For domain name for SSL, do `sapporokaraoke.ddns.net`
5. Cert + key should be stored in `C:\Certbot\live\sapporokaraoke.ddns.net`

Renewal of SSL Certificate:

Certbot should automatically renew and update those files in `C:\Certbot\live\sapporokaraoke.ddns.net`.
On expiration date, take the new certs and copy them to the `ssl/` folder, and push.