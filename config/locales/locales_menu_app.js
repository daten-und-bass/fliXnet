'use strict';

var today = new Date();
var year = today.getFullYear();

var localesMenuApp = {
  'fliXnet': {
    'de': {'DE': 'fliXnet'},
    'en': {'EN': 'fliXnet'},
    'es': {'ES': 'fliXnet'},
    'fr': {'FR': 'fliXnet'},
  },
  'Current Year YYYY': {
    'de': {'DE': year},
    'en': {'EN': year},
    'es': {'ES': year},
    'fr': {'FR': year},
  },
  'Menu': {
    'de': {'DE': 'Menü'},
    'en': {'EN': 'Menu'},
    'es': {'ES': 'menú'},
    'fr': {'FR': 'Menu'},
  },
  'Home': {
    'de': {'DE': 'Start'},
    'en': {'EN': 'Home'},
    'es': {'ES': 'Portada'},
    'fr': {'FR': 'Accueil'},
  },
  'About': {
    'de': {'DE': 'Über uns'},
    'en': {'EN': 'About'},
    'es': {'ES': 'Acerca'},
    'fr': {'FR': 'À propos'}, 
  },
  'Imprint': {
    'de': {'DE': 'Impressum'},
    'en': {'EN': 'Imprint'},
    'es': {'ES': 'Información Legal'},
    'fr': {'FR': 'Mentions Légales'}, 
  },
  'Contact': {
    'de': {'DE': 'Kontakt'},
    'en': {'EN': 'Contact'},
    'es': {'ES': 'Contacto'},
    'fr': {'FR': 'Contact'}, 
  },
  'Github Code': {
    'de': {'DE': 'Github Code'},
    'en': {'EN': 'Github Code'},
    'es': {'ES': 'Github Code'},
    'fr': {'FR': 'Github Code'}, 
  },
  'Login': {
    'de': {'DE': 'Login'},
    'en': {'EN': 'Login'},
    'es': {'ES': 'Acceder'},
    'fr': {'FR': 'Se connecter'}, 
  },
  'Register': {
    'de': {'DE': 'Anmeldung'},
    'en': {'EN': 'Register'},
    'es': {'ES': 'Registrar'},
    'fr': {'FR': 'Enregistrement'}, 
  },
  'Account': {
    'de': {'DE': 'Account'},
    'en': {'EN': 'Account'},
    'es': {'ES': 'Cuenta'},
    'fr': {'FR': 'Compte'}, 
  },
  'Logout': {
    'de': {'DE': 'Logout'},
    'en': {'EN': 'Logout'},
    'es': {'ES': 'Cerrar Sesión'},
    'fr': {'FR': 'Déconnexion'}, 
  },
  'The Movie Graph': {
    'de': {'DE': 'Der Filmgraph'},
    'en': {'EN': 'The Movie Graph'},
    'es': {'ES': 'El Grafo de las Películas'},
    'fr': {'FR': 'Le Graphe des Films'}, 
  },
  'Create a Relationship': {
    'de': {'DE': 'Verbindung speichern'},
    'en': {'EN': 'Create a Relationship'},
    'es': {'ES': 'Grabar una conexión'},
    'fr': {'FR': 'Enregistrer une relation'}, 
  },
  'Movies': {
    'de': {'DE': 'Filme'},
    'en': {'EN': 'Movies'},
    'es': {'ES': 'Películas'},
    'fr': {'FR': 'Films'},
  },
  'Create a Movie': {
    'de': {'DE': 'Film speichern'},
    'en': {'EN': 'Create a Movie'},
    'es': {'ES': 'Grabar una película'},
    'fr': {'FR': 'Enregistrer un film'}, 
  },
  'All Movies': {
    'de': {'DE': 'Alle Filme'},
    'en': {'EN': 'All Movies'},
    'es': {'ES': 'Todas las películas'},
    'fr': {'FR': 'Tous les films'}, 
  },
  'Persons': {
    'de': {'DE': 'Personen'},
    'en': {'EN': 'Persons'},
    'es': {'ES': 'Personas'},
    'fr': {'FR': 'Persons'},
  },
  'Create a Person': {
    'de': {'DE': 'Person speichern'},
    'en': {'EN': 'Create a Person'},
    'es': {'ES': 'Grabar una Persona'},
    'fr': {'FR': 'Enregistrer un Person'}, 
  },
  'All Persons': {
    'de': {'DE': 'Alle Personen'},
    'en': {'EN': 'All persons'},
    'es': {'ES': 'Todas las personas'},
    'fr': {'FR': 'Tous les persons'},
  },
  'A <female>': {
    'de': {'DE': 'Eine'},
    'en': {'EN': 'A'},
    'es': {'ES': 'Una'},
    'fr': {'FR': 'Une'},
  },
  'sample implementation of': {
    'de': {'DE': 'Beispielimplementierung von'},
    'en': {'EN': 'sample implementation of'},
    'es': {'ES': 'implementación ejemplo de'},
    'fr': {'FR': 'implémentation exemplaire de'},
  },
  'Movie Database': {
    'de': {'DE': 'Filmdatenbank'},
    'en': {'EN': 'Movie Database'},
    'es': {'ES': 'banco de datos de películas'},
    'fr': {'FR': 'banque de données des films'},
  },
  'Users': {
    'de': {'DE': 'Nutzer'},
    'en': {'EN': 'Users'},
    'es': {'ES': 'Usuarios'},
    'fr': {'FR': 'Utilisateurs'},
  },
  'Developers': {
    'de': {'DE': 'Entwickler'},
    'en': {'EN': 'Developers'},
    'es': {'ES': 'Productores'},
    'fr': {'FR': 'Développeurs'},
  },
};

module.exports = localesMenuApp;