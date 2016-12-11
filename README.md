### Розгортання проекту

Протестовано на наступних конфігураціях:
- Fedora 23, MongoDB 3.0.12, Node.js 6.4.0, Nginx 1.9.9
- Linux Mint 18, MongoDB 2.6.10, Node.js 7.1.0, Nginx 1.10.0
```
echo '127.0.0.1 auth.local.com client.local.com' >> /etc/hosts;
```
```
mv /etc/nginx/nginx.conf /etc/nginx/nginx.conf.bac;
cp /var/www/authrest/static/nginx.conf /etc/nginx/nginx.conf;
mkdir /var/log/nginx;
nginx -t;
```
Якщо виникне помилка на зразок:
```
nginx: [emerg] getpwnam("nginx") failed in /etc/nginx/nginx.conf:1
```
слід виконати (вказавши свій \<NGINX USER\>):
```
tail -n +2 /etc/nginx/nginx.conf > temp && mv temp /etc/nginx/nginx.conf;
echo 'user <NGINX USER>'; | cat - /etc/nginx/nginx.conf > temp && mv temp /etc/nginx/nginx.conf
```
```
service nginx restart;
```
Встановлюємо TTL-index в  MongoDB щоб токени видалялися через 10хв після створення, за умови, що дата створення не оновлювалась:
```
mongo
>> use restAPIApp
>> db.tokens.createIndex({"createdAt": 1},{expireAfterSeconds: 10*60})
```
```
git clone https://github.com/volodymyrkoval/rest_auth.git /var/www/authrest;
cd /var/www/authrest;
npm i;
npm run-script start;
 ```

Після цього веб-інтерфейс буде доступний в браузері:
<a href="http://client.local.com">client.local.com</a>

REST-сервіс доступний через <a href="http://auth.local.com">auth.local.com</a> та <a href="http://127.0.0.1:4000">127.0.0.1:4000</a>