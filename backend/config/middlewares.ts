export default [
  'strapi::logger',
  'strapi::errors',
  'strapi::security',
  {
    name: 'strapi::cors',
    config: {
      enabled: true,
      header: '*',
      origin: ['http://localhost:1337']
    }
  },

  'strapi::poweredBy',
  'strapi::query',
  'strapi::body',
  'strapi::session',
  'strapi::favicon',
  'strapi::public',
];

// module.exports = ({ env }) => ({
//   settings: {
//     cors: {
//       origin: ['http://localhost:3000'], // Replace with your frontend's URL
//       headers: ['Content-Type', 'Authorization', 'Origin', 'Accept'],
//     },
//   },
// });
