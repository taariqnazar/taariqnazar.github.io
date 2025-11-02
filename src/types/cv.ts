export interface Profile {
  name: string;
  label: string;
  email: string;
  phone?: string;
  address?: {
    street?: string; city?: string; region?: string;
    postalCode?: string; country?: string;
  };
  url?: string;
  location?: { city?: string; countryCode?: string };
  profiles?: Array<{ network: string; username?: string; url?: string }>;
}

export interface Education {
  institution: string;
  studyType?: string;
  area?: string;
  startDate?: string | null;
  endDate?: string | null;
  ['x-degrees']?: Array<{ level: string; area: string; startDate?: string; endDate?: string }>;
  courses?: string[];
}

export interface WorkItem {
  name: string; position: string;
  startDate?: string | null; endDate?: string | null;
  location?: string; summary?: string;
  highlights?: string[];
}

export interface Publication {
  name: string;
  authors?: string[];
  publisher?: string;
  releaseDate?: string;
  volume?: string; issue?: string; pages?: string;
  url?: string;
  ['x-venuePublisher']?: string;
  ['x-status']?: string;
  summary?: string;
}

export interface Skill { name: string; keywords?: string[] }
export interface Project {
  name: string; role?: string; startDate?: string | null; endDate?: string | null;
  url?: string; summary?: string; keywords?: string[];
}
export interface Language { language: string; fluency?: string }

export interface CV {
  profile: Profile;
  summary?: string;
  education?: Education[];
  work?: WorkItem[];
  publications?: Publication[];
  awards?: Array<{ title: string; date?: string; awarder?: string; summary?: string }>;
  skills?: Skill[];
  projects?: Project[];
  languages?: Language[];
  interests?: string[];

  // Extensions
  ['x-currentFocus']?: string;
  ['x-currentInterests']?: string[];
  ['x-teaching']?: Array<any>;
  ['x-service']?: Array<any>;
  ['x-talks']?: Array<any>;
  ['x-links']?: Array<{ label: string; url: string }>;

  meta?: { notes?: string; lastUpdated?: string };
}
