# url-shortener

* Edit docker-compose.yml. Change *at least* `SESSION_SECRET` and the `volumes` if you want persistant storage...
* `docker-compose up url-shortener`
* `docker-compose exec url-shortener node bin/insert_admin_user.js -uUSER -pPASSWORD
* Browse http://localhost:3001/
* Have fun!
