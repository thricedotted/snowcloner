const examples = [
  {
    id: 1,
    name: 'Little Treat',
    data: {
      $TEMPLATE$: '~ #animal.s.capitalize# can have a little #veggie# as a treat ~ #cute#',

      animal: {
        f: ['animals', 'common.json'],
        d: [{ name: 'key', selected: 'animals' }]
      },

      veggie: {
        f: ['foods', 'vegetables.json'],
        d: [{ name: 'key', selected: 'vegetables' }]
      },

      cute: {
        f: ['words', 'emoji', 'cute_kaomoji.json'],
        d: [{ name: 'key', selected: 'cuteKaomoji' }]
      }
    }
  },

  {
    id: 2,
    name: 'Apple Horse Sport!',
    data: {
      $TEMPLATE$: '#apple# #horse# #sport.capitalizeAll#!',

      apple: {
        f: ['foods', 'apple_cultivars.json'],
        d: [{ name: 'key', selected: 'cultivars' }]
      },

      horse: {
        f: ['animals', 'horses.json'],
        d: [{ name: 'key', selected: 'horses' }]
      },

      sport: {
        f: ['sports', 'sports.json'],
        d: [{ name: 'key', selected: 'sports' }]
      },
    }
  },

  {
    id: 3,
    name: 'Identity Studies',
    data: {
      $TEMPLATE$: 'Be your own #noun#: now, you are #noun#.',

      noun: {
        f: ['words', 'nouns.json'],
        d: [{ name: 'key', selected: 'nouns' }]
      },
    }
  },

  {
    id: 4,
    name: 'Far Away',
    data: {
      $TEMPLATE$: '#weather.lowercase#\nin #p-city.lowercase#\n\nmy heart is #size.a#\n#paint.lowercase# #paint.lowercase#\nsurrounded by #material#\n\n#p-population.formatNumber# mouths open at once:\n#fortune.uppercase#\n\n#p-state.lowercase# is so far away',

      weather: {
        f: ['science', 'weather_conditions.json'],
        d: [{ name: 'key', selected: 'conditions' }]
      },

      p: {
        f: ['geography', 'us_cities.json'],
        d: [
          { name: 'key', selected: 'cities' },
          { name: 'filter', selected: 'all' }
        ]
      },

      size: {
        f: ['science', 'hail_size.json'],
        d: [
          { name: 'key', selected: 'hail' },
          { name: 'filter', selected: 'analogs' }
        ]
      },

      paint: {
        f: ['colors', 'paints.json'],
        d: [
          { name: 'key', selected: 'colors' },
          { name: 'filter', selected: 'color' }
        ]
      },

      material: {
        f: ['materials', 'building-materials.json'],
        d: [{ name: 'key', selected: 'building materials' }]
      },

      fortune: {
        f: ['divination', 'tarot_interpretations.json'],
        d: [
          { name: 'key', selected: 'tarot_interpretations' },
          { name: 'filter', selected: 'fortune_telling' },
        ]
      }
    }
  },

  {
    id: 5,
    name: 'Tarot Quick Draw',
    data: {

      $TEMPLATE$: "== #tarot1-name.uppercase# ==\nThis card concerns #tarot1-keywords.uppercase# in the context of #event.uppercase#.\nCONSIDER #tarot1-meanings-light.lowercase#.\nBEWARE #tarot1-meanings-shadow.lowercase#.\n\n\n== #tarot2-name.uppercase# ==\nThis card concerns #tarot2-keywords.uppercase# in the context of #event.uppercase#.\nCONSIDER #tarot2-meanings-light.lowercase#.\nBEWARE #tarot2-meanings-shadow.lowercase#.\n\n\n== #tarot3-name.uppercase# ==\nThis card concerns #tarot3-keywords.uppercase# in the context of #event.uppercase#.\nCONSIDER #tarot3-meanings-light.lowercase#.\nBEWARE #tarot3-meanings-shadow.lowercase#.",

      tarot1: {
        f: ['divination', 'tarot_interpretations.json'],
        d: [
          { name: 'key', selected: 'tarot_interpretations' },
          { name: 'filter', selected: 'all' }
        ]
      },

      tarot2: {
        f: ['divination', 'tarot_interpretations.json'],
        d: [
          { name: 'key', selected: 'tarot_interpretations' },
          { name: 'filter', selected: 'all' }
        ]
      },

      tarot3: {
        f: ['divination', 'tarot_interpretations.json'],
        d: [
          { name: 'key', selected: 'tarot_interpretations' },
          { name: 'filter', selected: 'all' }
        ]
      },

      event: {
        f: ['archetypes', 'event.json'],
        d: [
          { name: 'key', selected: 'events' },
          { name: 'filter', selected: 'name' }
        ]
      }
    }
  }
]

export default examples