
Installation: 

if amazonlinux: 
yum -y groupinstall 'Development Tools'
yum install -y libpng-devel libjpeg-devel libwebp-tools libglvnd-glx libXi
curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.0/install.sh | bash
export NVM_DIR="/root/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh" 
nvm install 14
npm install

if ubuntu:
apt-get update
apt-get -y install build-essential curl
apt -y install python
curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.0/install.sh | bash
export NVM_DIR="/root/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh" 
nvm install 14
npm install

for webp images:
 yum install -y libpng-devel libjpeg-devel libwebp-tools libglvnd-glx libXi

mysql.server start