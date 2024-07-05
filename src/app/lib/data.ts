import { LatLngBounds } from "leaflet";
import { v4 } from "uuid";
import { DateTime } from "luxon";
import { DetailedEventData, EventData, LocationData, LocationEventData } from "./definitions/data";
import { EventsSummaryProps } from "./definitions/props";

const events: LocationEventData[] = [
  { id: v4(), isMain: false, name: "Evento com nome incrível demais", startsAt: DateTime.now(), tags: ["festa"] },
  { id: v4(), isMain: true, name: "Evento com nome incrível demais", startsAt: DateTime.now(), tags: [] },
  { id: v4(), isMain: false, name: "Evento com nome incrível demais", startsAt: DateTime.now(), tags: ["palestra", "palestra motivacional"] },
  { id: v4(), isMain: false, name: "Evento com nome incrível demais", startsAt: DateTime.now(), tags: [] },
  { id: v4(), isMain: false, name: "Evento com nome incrível demais", startsAt: DateTime.now(), tags: [] },
  { id: v4(), isMain: false, name: "Evento com nome incrível demais", startsAt: DateTime.now(), tags: [] },
  { id: v4(), isMain: false, name: "Evento com nome incrível demais", startsAt: DateTime.now(), tags: ["festa eletronica"] },
  { id: "a2559964-a225-423b-8d02-3587496f0dcb", isMain: false, name: "Evento com nome incrível demais", startsAt: DateTime.now(), tags: [] },
  { id: v4(), isMain: false, name: "Evento com nome incrível demais", startsAt: DateTime.now(), tags: [] },
  { id: v4(), isMain: false, name: "Evento com nome incrível demais", startsAt: DateTime.now(), tags: ["festa junina"] },
  { id: v4(), isMain: true, name: "Evento com nome incrível demais", startsAt: DateTime.now(), tags: [] },
  { id: v4(), isMain: false, name: "Evento com nome incrível demais", startsAt: DateTime.now(), tags: [] },
  { id: v4(), isMain: false, name: "Evento com nome incrível demais", startsAt: DateTime.now(), tags: [] },
  { id: v4(), isMain: false, name: "Evento com nome incrível demais", startsAt: DateTime.now(), tags: [] },
  { id: v4(), isMain: false, name: "Evento com nome incrível demais", startsAt: DateTime.now(), tags: ["festa do pijama", "festa"] },
  { id: v4(), isMain: true, name: "Evento com nome incrível demais", startsAt: DateTime.now(), tags: [] },
  { id: v4(), isMain: false, name: "Evento com nome incrível demais", startsAt: DateTime.now(), tags: [] },
  { id: v4(), isMain: true, name: "Evento com nome incrível demais", startsAt: DateTime.now(), tags: ["festa", "festa pop"] },
  { id: v4(), isMain: true, name: "Evento com nome incrível demais", startsAt: DateTime.now(), tags: [] },
  { id: v4(), isMain: false, name: "Evento com nome incrível demais", startsAt: DateTime.now(), tags: ["yoga", "yoga ao ar livre"] },
  { id: v4(), isMain: false, name: "Evento com nome incrível demais", startsAt: DateTime.now(), tags: [] },
]

const locations: LocationData[] = [
  {
    id: v4(), position: [-22.912287, -43.184861], isHot: false, events: [events[0]]
  },
  {
    id: "7f0cda24-3186-4f96-a8d2-c06471ac13ff", position: [-22.906793, -43.178467], isHot: true, events: [events[1], events[2], events[3], events[4]]
  },
  {
    id: v4(), position: [-22.908927, -43.170999], isHot: false, events: [events[5]]
  },
  {
    id: v4(), position: [-22.917940, -43.176106], isHot: false, events: [events[6], events[7], events[8], events[9]]
  },
  {
    id: v4(), position: [-22.897658, -43.183780], isHot: true, events: [events[10], events[11]]
  },
  {
    id: v4(), position: [-22.904428, -43.192048], isHot: false, events: [events[12], events[13], events[14],]
  },
  {
    id: v4(), position: [-22.924689, -43.173063], isHot: true, events: [events[15], events[16], events[17], events[18]]
  },
  {
    id: v4(), position: [-22.931264, -43.179151], isHot: false, events: [events[19], events[20]]
  },
];

export function fetchLocationFromId(id: string | undefined): LocationData | undefined {
  if (id === undefined) return undefined;

  for (let index = 0; index < locations.length; index++) {
    const location = locations[index];
    if (location.id === id) return location;
  }
  return undefined;
}

export function fetchLocationsAtBounds(bounds: LatLngBounds): LocationData[] {
  const currentLocations: LocationData[] = [];
  for (let index = 0; index < locations.length; index++) {
    if (bounds.contains(locations[index].position)) currentLocations.push(locations[index]);
  }
  return currentLocations;
}

export function fetchLocationsFromQuery(query: string, bounds: LatLngBounds): LocationData[] {
  const currentLocations: LocationData[] = [];
  const parsedQuery = query.trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "").split('.').join("");
  const tags: string[] = parsedQuery.toLowerCase().split(" ");
  for (let index = 0; index < locations.length; index++) {
    const location = locations[index];
    if (!bounds.contains(location.position)) continue;
    if (currentLocations.indexOf(location) >= 0) continue;
    for (let indexj = 0; indexj < location.events.length; indexj++) {
      const event = location.events[indexj];
      for (let indexk = 0; indexk < tags.length; indexk++) {
        const tag = tags[indexk];
        if (event.tags.indexOf(tag) >= 0) currentLocations.push(location);
      }
    }
  }

  return currentLocations;
}

export function fetchMainEventsAtBounds(bounds: LatLngBounds): LocationEventData[] {
  const mainEvents: LocationEventData[] = locations.filter((l) => l.isHot).flatMap((l) => {
    const events = []
    for (let index = 0; index < l.events.length; index++) {
      const event = l.events[index];
      if (event.isMain && bounds.contains(l.position)) {
        // event.position = l.position;
        event.locationId = l.id;
        events.push(event);
      }
    }
    return events;
  });

  return mainEvents;
}

export function fetchEventsFromLocation(id: string): LocationEventData[] {
  for (let index = 0; index < locations.length; index++) {
    const location = locations[index];
    if (location.id === id) {
      let events: LocationEventData[] = [];
      events = location.events.map((ev) => {
        // ev.position = location.position;
        ev.locationId = location.id;
        return ev;
      });
      return events;
    }
  }
  return [];
}

export function fetchEventsFromLocationWithQuery(id: string, query: string): LocationEventData[] {
  const tags: string[] = query.toLowerCase().split(" ");
  const validEvents: LocationEventData[] = [];
  for (let index = 0; index < locations.length; index++) {
    const location = locations[index];
    if (location.id !== id) continue;
    if (location.events.length === 0) break;
    for (let indexj = 0; indexj < location.events.length; indexj++) {
      const event = location.events[indexj]
      for (let indexk = 0; indexk < tags.length; indexk++) {
        const tag = tags[indexk];
        if (
          event.tags.indexOf(tag) >= 0 &&
          validEvents.indexOf(event) < 0
        ) {
          // event.position = location.position;
          event.locationId = location.id;
          validEvents.push(event);
        }
      }
    }
  }
  return validEvents;
}

export function fetchEventsSumaryFromLocation(id: string): EventsSummaryProps | undefined {
  for (let index = 0; index < locations.length; index++) {
    const location = locations[index];
    if (location.id === id && location.events[0] !== undefined) {
      const summary: EventsSummaryProps = {
        id: location.events[0].id,
        nextEventName: location.events[0].name,
        nextEventDay: location.events[0].startsAt.day,
        nextEventMonth: location.events[0].startsAt.month,
        remainingEventsCount: location.events.length > 0 ? location.events.length - 1 : undefined
      };
      return summary;
    }
  }
  return undefined;
}

export function fetchEventsSumaryFromLocationWithQuery(id: string, query: String): EventsSummaryProps | undefined {
  const tags: string[] = query.toLowerCase().split(" ");
  const validEvents: LocationEventData[] = [];
  for (let index = 0; index < locations.length; index++) {
    const location = locations[index];
    if (location.id !== id) continue;
    if (location.events.length === 0) break;
    for (let indexj = 0; indexj < location.events.length; indexj++) {
      const event = location.events[indexj]
      for (let indexk = 0; indexk < tags.length; indexk++) {
        const tag = tags[indexk];
        if (
          event.tags.indexOf(tag) >= 0 &&
          validEvents.indexOf(event) < 0
        ) validEvents.push(event);
      }
    }
  }
  if (validEvents.length > 0) {
    const summary: EventsSummaryProps = {
      id: validEvents[0].id,
      nextEventName: validEvents[0].name,
      nextEventDay: validEvents[0].startsAt.day,
      nextEventMonth: validEvents[0].startsAt.month,
      remainingEventsCount: validEvents.length > 0 ? validEvents.length - 1 : undefined
    };
    return summary;
  }
  return undefined;
}

export function fetchEventData(id: string, summary?: boolean): EventData | undefined {
  const description: string = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec tincidunt felis non erat sagittis, at ultrices orci fermentum. Donec rutrum interdum fringilla. Nulla interdum porttitor volutpat. Etiam in quam justo. Donec vitae erat eget dui accumsan varius. Praesent at bibendum urna. Proin scelerisque felis ac libero efficitur hendrerit. Morbi eleifend pulvinar dapibus. Etiam ac eros pellentesque, auctor dui dapibus, gravida lorem.

  Sed varius erat vel velit tincidunt tempus. Mauris nisl lacus, egesta...`;
  for (let index = 0; index < locations.length; index++) {
    const location = locations[index];
    for (let indexJ = 0; indexJ < location.events.length; indexJ++) {
      const event = location.events[indexJ];
      if (event.id === id) {
        return {
          id: event.id,
          name: event.name,
          startsAt: event.startsAt,
          isMain: event.isMain,
          description: description,
          image: "https://dummyimage.com/400x250.png/000/fff&text=CardMediumHeader",
          producer: "Producer",
          address: "Rua St. A, nº 112, Complemento, Santo Cristo, Rio de Janeiro - RJ, Brasil",
          locationId: location.id
        }
      }
    }
  }
  return undefined;
}

export function fetchDetailedEventData(id: string): DetailedEventData | undefined {
  const description = `Sed varius erat vel velit tincidunt tempus. Mauris nisl lacus, egestas at diam non, iaculis fringilla purus. Aenean porta fringilla erat, at volutpat enim pellentesque vel. Vivamus aliquet tempus volutpat. Duis lacinia malesuada purus. Praesent eu vestibulum nisi. Morbi urna enim, gravida sed cursus id, varius vel nibh. Integer eleifend laoreet luctus. Integer nec nibh turpis. Donec posuere est ac nibh faucibus, pulvinar iaculis magna placerat. Mauris fringilla egestas magna, sit amet fringilla lacus tempus ac. In malesuada dignissim ligula, et ullamcorper eros auctor eu. Morbi dictum lacus eu nulla feugiat convallis vitae et turpis.

  Vivamus tellus lorem, egestas vitae feugiat vitae, convallis sed risus. Phasellus suscipit, risus sit amet molestie semper, massa nisl posuere lectus, vel lobortis enim libero in odio. Fusce tortor ligula, faucibus nec elit sed, pharetra gravida metus. Sed sodales quam a massa accumsan egestas. Quisque vel orci scelerisque, volutpat turpis at, feugiat orci. Nullam cursus purus ac lectus tincidunt ullamcorper. Quisque dictum mi eget quam rutrum lacinia. Suspendisse eu metus dui. Cras metus eros, placerat vitae hendrerit eget, facilisis a ligula. Nullam suscipit varius purus quis consectetur. Cras a hendrerit purus. Morbi tincidunt neque a risus fermentum, et ultrices tellus aliquet. Aenean pretium venenatis metus id pharetra.

  Suspendisse pellentesque feugiat iaculis. Etiam in arcu tristique, pellentesque nibh eu, tincidunt neque. Nunc ut lorem lorem. Nam maximus lacus eu bibendum ullamcorper. Etiam lorem dui, tempus ut est a, pretium laoreet mi. Praesent lacinia faucibus blandit. Curabitur molestie justo non dignissim porttitor. Mauris sed ex id elit ultrices feugiat. Etiam mi sem, varius non ligula hendrerit, condimentum lobortis mi. Nunc accumsan, leo non mattis aliquam, urna lorem pellentesque quam, eget auctor odio nunc et nunc.

  Mauris consequat augue ut dolor elementum, sit amet fermentum orci tincidunt. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Nunc non egestas metus. Fusce est libero, commodo ac ante non, venenatis mollis arcu. Etiam tristique aliquam scelerisque. Sed accumsan ex ac nibh posuere pharetra eget eu orci. Nulla luctus magna in dignissim fermentum. Integer at scelerisque velit, in tempus leo. Praesent posuere, justo in tincidunt ornare, est dolor sollicitudin leo, sit amet ullamcorper odio eros eu diam. Ut ex nibh, pharetra nec aliquam sit amet, auctor eget felis. Proin quis sapien vel ipsum elementum vestibulum. Nam pharetra mi orci, quis ultrices neque viverra non.

  Mauris porta orci dolor, et vehicula nulla fermentum vel. Proin ac nibh quam. Praesent ac urna quam. Ut accumsan mauris scelerisque lectus posuere ultrices. Phasellus accumsan porta mi, in laoreet arcu ultricies sed. Vivamus in enim justo. Integer ipsum purus, aliquet at tortor ac, sagittis tempus est. Pellentesque sit amet risus eget magna fermentum fringilla et commodo neque. Proin sed elit nec lectus aliquet ullamcorper. Nam tempor scelerisque sapien a posuere. Ut molestie magna enim.

  Praesent sollicitudin erat id mauris congue posuere. Nullam nunc enim, tincidunt id mattis nec, congue eget ipsum. Curabitur iaculis, turpis in consequat tincidunt, elit quam gravida risus, sed varius mi risus non est. Donec dapibus felis in lobortis fringilla. Vestibulum ut mi vulputate, pretium tellus ut, viverra velit. Suspendisse potenti. Donec volutpat leo vel urna fermentum eleifend. In ultricies odio eget ligula dignissim, ac ornare odio pharetra. Sed sed libero molestie, scelerisque orci quis, scelerisque risus. Sed fermentum suscipit sem eget faucibus. Etiam sodales at nibh ac sollicitudin. Sed pulvinar nibh at ante egestas, sed rhoncus nisi malesuada. Duis tincidunt nibh nisi, vel volutpat ex fermentum ut. Ut felis elit, congue sit amet eros quis, porta volutpat eros. Quisque at lectus id lacus cursus commodo vel ac lorem. Vivamus egestas varius risus eget dapibus.
`;
  for (let index = 0; index < locations.length; index++) {
    const location = locations[index];
    for (let indexJ = 0; indexJ < location.events.length; indexJ++) {
      const event = location.events[indexJ];
      if (event.id === id) {
        return {
          id: event.id,
          name: event.name,
          startsAt: event.startsAt,
          finishesAt: DateTime.now(),
          isMain: event.isMain,
          description: description,
          image: "https://dummyimage.com/1024x720.png/000/fff&text=CardLargeHeader",
          producer: "Producer",
          address: "Rua St. A, nº 112, Complemento, Santo Cristo, Rio de Janeiro - RJ, Brasil",
          locationId: location.id,
          ticketsAllotments: [
            {
              id: v4(),
              name: "Allotment 1",
              value: 10050,
              maxAmount: 5
            },
            {
              id: v4(),
              name: "Allotment 2",
              value: 12005,
              maxAmount: 7
            },
            {
              id: v4(),
              name: "Allotment Promo",
              value: 5210,
              maxAmount: 2
            },
          ]
        }
      }
    }
  }
  return undefined;
}

export function fetchEventsFromQuery(query: string, bounds: LatLngBounds) {
  const parsedQuery = query.trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "").split('.').join("");
  const tags: string[] = parsedQuery.toLowerCase().split(" ");
  const validEvents: LocationEventData[] = [];
  for (let index = 0; index < locations.length; index++) {
    const location = locations[index];
    if (!bounds.contains(location.position)) continue;
    for (let indexk = 0; indexk < location.events.length; indexk++) {
      const event = location.events[indexk];
      if (validEvents.indexOf(event) >= 0) continue;
      for (let indexj = 0; indexj < tags.length; indexj++) {
        const tag = tags[indexj];
        if (event.tags.indexOf(tag) >= 0) {
          event.locationId = location.id;
          validEvents.push(event);
        }
      }
    }
  }

  return validEvents;
}