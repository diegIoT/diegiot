//asignar un nombre y versión al cache
const CACHE_NAME = 'v1_cache_CV_Diego',
    urlsToCache = [
        './',
        './vendor/bootstrap/css/bootstrap.min.css',
        'https://fonts.googleapis.com/css?family=Saira+Extra+Condensed:500,700',
        'https://fonts.googleapis.com/css?family=Muli:400,400i,800,800i',
        './vendor/fontawesome-free/css/all.min.css',
        './css/resume.min.css',
        'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css',
        './img/favicon-diego.png',
        './img/pwa/icon_128.png',
        './img/pwa/icon_384.png',
        './img/diego-mena.png',
        './img/colombia.png',
        './img/usa.png',
        './img/gallery/telemetria-lorawan.jpg',
        './img/gallery/pcb-kicad.jpg',
        './img/gallery/reproductor-lsc.jpg',
        './img/gallery/visor-molecules.jpg',
        './img/gallery/cursos-unad.jpg',
        './img/gallery/review-block.jpg',
        './img/thumbnail/telemetria-lorawan.jpg',
        './img/thumbnail/pcb-kicad.jpg',
        './img/thumbnail/reproductor-lsc.jpg',
        './img/thumbnail/visor-molecules.jpg',
        './img/thumbnail/cursos-unad.jpg',
        './img/thumbnail/review-block.jpg',
        './vendor/jquery/jquery.min.js',
        './vendor/bootstrap/js/bootstrap.bundle.min.js',
        './vendor/jquery-easing/jquery.easing.min.js',
        './js/resume.min.js',
        './js/accessibility.js',
        './js/gallery.js'
    ];

//durante la fase de instalación, generalmente se almacena en caché los activos estáticos
self.addEventListener('install', e => {
    e.waitUntil(
        caches.open(CACHE_NAME)
        .then(cache => {
            return cache.addAll(urlsToCache)
                .then(() => self.skipWaiting())
        })
        .catch(err => console.log('Falló registro de cache', err))
    )
});

//una vez que se instala el SW, se activa y busca los recursos para hacer que funcione sin conexión
self.addEventListener('activate', e => {
    const cacheWhitelist = [CACHE_NAME]

    e.waitUntil(
        caches.keys()
        .then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    //Eliminamos lo que ya no se necesita en cache
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        return caches.delete(cacheName)
                    }
                })
            )
        })
        // Le indica al SW activar el cache actual
        .then(() => self.clients.claim())
    )
});

//cuando el navegador recupera una url
self.addEventListener('fetch', e => {
    //Responder ya sea con el objeto en caché o continuar y buscar la url real
    e.respondWith(
        caches.match(e.request)
        .then(res => {
            if (res) {
                //recuperar del cache
                return res
            }
            //recuperar de la petición a la url
            return fetch(e.request)
        })
    )
});