export type PaulFloodGalleryImage = {
  src: string;
  alt: string;
  caption: string;
  credit: string;
  sourceUrl?: string;
};

/** Header reel for `/paul-flood` — local uploads with archive provenance. */
export const PAUL_FLOOD_GALLERY: PaulFloodGalleryImage[] = [
  {
    src: "/uploads/1985/st-marys-1985-team-01.jpg",
    alt: "St. Mary's College RFC team photograph, 1984–85 season",
    caption: "1984/85 — St. Mary's College RFC",
    credit: "James Maguire Archive",
    sourceUrl: "https://smcrfcmaguire.smugmug.com/JamesMaguireArchive/19841985-1/i-jrXqn7B"
  },
  {
    src: "/uploads/2010/st-marys-capture-paul-flood-memorial-trophy-irfu.jpg",
    alt: "St. Mary's capture the Paul Flood Memorial Trophy, 2010",
    caption: "Inaugural Paul Flood Cup — 2010",
    credit: "Irish Rugby / IRFU",
    sourceUrl: "https://www.irishrugby.ie/2010/03/02/st-marys-capture-paul-flood-memorial-trophy/"
  },
  {
    src: "/uploads/2013/old-belvedere-paul-flood-cup-sportsfile-741923.jpg",
    alt: "Paul Flood Cup lifted at Old Belvedere, 2013",
    caption: "Paul Flood Cup final — 2013",
    credit: "Matt Browne / Sportsfile"
  },
  {
    src: "/uploads/2014/clondalkin-v-gorey-team-photo.jpg",
    alt: "Clondalkin team at the Paul Flood Cup final, 2014",
    caption: "Paul Flood Cup final — 2014",
    credit: "Sharon Flanagan / Clondalkin RFC"
  },
  {
    src: "/uploads/2022/tullamore-v-tullow-paul-flood-cup-sportsfile-2213920.jpg",
    alt: "Tullow celebrate Paul Flood Cup victory, 2022",
    caption: "Paul Flood Cup final — 2022",
    credit: "Ben McShane / Sportsfile"
  },
  {
    src: "/uploads/2026/navan-paul-flood-cup-winners.webp",
    alt: "Navan celebrate Paul Flood Cup win, 2026",
    caption: "Paul Flood Cup winners — 2026",
    credit: "Navan RFC"
  }
];
