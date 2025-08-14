# Math Microservice - API pentru Operații Matematice
Math Microservice este o aplicație web completă care oferă un set de operații matematice simple expuse printr-un backend REST API și o interfață de utilizator prietenoasă. Proiectul este construit folosind:

- Flask + SQLite + JWT Auth

- React + Vite

- Docker pentru containerizare completă

- Redis pentru caching performant

- Statistici și dashboard pentru monitorizare operații

# Arhitectura si tehncologii folosite
## Backend (Python/Flask) ##

- **Flask** microframework (MVCS pattern)

- **SQLite** pentru stocare locală

- JWT pentru autentificare/autorizație

- **SQLAlchemy** pentru ORM

- Pydantic pentru validare input

- Flask-Caching + Redis pentru caching

- Flask-CORS, Flask-JWT-Extended

- Stats + Logs filtrate per utilizator

## Frontend ##
- **React + Vite**
  
- Pagini separate pentru ``Login/Register``, ``Calculator``, ``Stats Dashboard``

- Hook useAuth + context pentru sesiune

- Design responsive

- Rute protejate (ProtectedRoute)

## Docker ##

- Separare servicii (frontend/backend/redis)

- Build & run prin docker-compose

- Mapping porturi + volume persistente

# Cum rulez #
``bash``

<pre lang="bash"><code>docker-compose up --build </code></pre>

- Accesează frontend-ul la: ``http://localhost:5173``

- API-ul backend: ``http://localhost:5000``

# Dashboard & Monitoring #
Se acceseaza interfață după autentificare din meniul care apare atunci cand apasam pe iconita profilului pagina de statistici

Include:

Taburile de selectie care filtreaza continutul afisat in:
- General Presentation
- Operations
- Perfomance

Fiecare tab permite afisarea unui subset de statistici relevante pentru utilizator

Sectiunea de General Presentation ofera o privire de ansamblu asupra utilizarii aplicatiei prin intermediul a trei carduri:
- Total requests:
  - reprezinta numarul de cereti trimise de utilizatorul curent catre backend

- Types of operations:
  - arata cate tipuri de operatii matematice au fost utilizate cel putin o data

- The most popular:
  - arata operatia matematica cea mai folosita

Toate statisticile sunt filtrate pe utilizatorul curent
<pre lang="bash"><code> @cache.memoize(timeout=300) </code></pre>

# Caching #
- implementat cu Flask-Caching + Redis
- toate functiile matematice sunt decorate cu:
  
## Testare cache Redis ##
<pre lang="bash"><code>
  # Endpoint test:
  GET http://localhost:5000/cache/test/10
  
  # Verificare în Redis CLI:
  127.0.0.1:6379> KEYS *
  127.0.0.1:6379> MEMORY USAGE flask_cache_app.services.logic.fibonacci_memver
</code></pre>

# Autentificare si Autorizare #
- JWT generat la login și salvat în ``sessionStorage``

- Toate rutele protejate folosesc `` @jwt_required()`` în Flask

- Frontend-ul folosește ``useAuth`` pentru a gestiona sesiunea

# Securitate #
- Parolele sunt criptate cu `` werkzeug.security ``

- Tokenul JWT este generat cu ``flask_jwt_extended``

- Validări input folosind ``Pydantic``
