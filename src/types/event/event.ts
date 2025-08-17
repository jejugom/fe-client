interface Event {
  news: {
    category: number;
    title: string;
    summary: string;
    link: string;
    date: string;
  };
  point: number;
}

export type { Event };
