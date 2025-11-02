<script setup lang="ts">
import { computed } from 'vue';
import { useCv } from '../composables/useCV';

const cv = useCv();

/* ----------------- date helpers ----------------- */
// Parse YYYY or YYYY-MM safely
const toDate = (s?: string | null) => {
  if (!s) return null;
  if (s.length === 4) return new Date(Number(s), 0, 1); // Jan 1 of that year
  return new Date(s);
};

const fmtMonth = new Intl.DateTimeFormat(undefined, { month: 'short' });
const fmtYear  = new Intl.DateTimeFormat(undefined, { year: 'numeric' });

function fmtOne(s?: string | null) {
  const d = toDate(s);
  if (!d) return '';
  // If original was YYYY only
  if (s && s.length === 4) return fmtYear.format(d);
  return `${fmtMonth.format(d)} ${fmtYear.format(d)}`;
}

/** Compact range:
 * Jan–Jun 2025 when same year & both months,
 * Aug 2022 – Present otherwise,
 * 2024 if only a single year supplied, etc.
 */
function fmtRangeCompact(start?: string | null, end?: string | null) {
  if (!start && !end) return '';
  if (start && !end) return `${fmtOne(start)} – Present`;
  if (!start && end)  return fmtOne(end);

  const ds = toDate(start)!;
  const de = toDate(end)!;

  const sameYear = fmtYear.format(ds) === fmtYear.format(de);
  const startHadMonth = !!(start && start.length > 4);
  const endHadMonth   = !!(end && end.length > 4);

  if (sameYear && startHadMonth && endHadMonth) {
    return `${fmtMonth.format(ds)}–${fmtMonth.format(de)} ${fmtYear.format(ds)}`;
  }
  return `${fmtOne(start)} – ${fmtOne(end)}`;
}

function yearOf(s?: string | null) {
  if (!s) return '';
  return s.slice(0, 4);
}

/* ----------------- computed sections ----------------- */
const teaching = computed(() => {
  const list = (cv.value?.['x-teaching'] ?? []).slice();
  const ts = (s?: string | null) => (s ? Date.parse(s.length === 4 ? `${s}-01-01` : s) : -Infinity);
  list.sort((a: any, b: any) => {
    const as = ts(a.startDate), bs = ts(b.startDate);
    if (as !== bs) return bs - as;
    const ae = ts(a.endDate), be = ts(b.endDate);
    return (be || Infinity) - (ae || Infinity);
  });
  return list;
});

type MiscItem =
  | { kind: 'service'; startDate?: string | null; endDate?: string | null; role?: string; org?: string }
  | { kind: 'talk'; date?: string | null; title?: string; location?: string }
  | { kind: 'award'; date?: string | null; title?: string; awarder?: string; summary?: string };

const miscItems = computed<MiscItem[]>(() => {
  const svc   = (cv.value?.['x-service'] ?? []).map((s: any) => ({ kind: 'service', ...s })) as MiscItem[];
  const talks = (cv.value?.['x-talks'] ?? []).map((t: any) => ({ kind: 'talk', ...t })) as MiscItem[];
  const awards= (cv.value?.awards ?? []).map((a: any) => ({ kind: 'award', ...a })) as MiscItem[];
  const all = [...svc, ...talks, ...awards];
  const ts = (x: MiscItem) => {
    const raw =
      x.kind === 'service' ? (x.startDate ?? x.endDate ?? null)
      : x.kind === 'talk'   ? (x.date ?? null)
      :                       (x.date ?? null);
    if (!raw) return -Infinity;
    return Date.parse(raw.length === 4 ? `${raw}-01-01` : raw);
  };
  return all.sort((a, b) => ts(b) - ts(a));
});

type Pub = {
  name: string;
  authors?: string[];
  publisher?: string;
  releaseDate?: string;
  volume?: string;
  issue?: string;
  pages?: string;
  url?: string;
  ['x-status']?: string;
  ['x-venuePublisher']?: string;
};

function joinAuthors(a?: string[]) {
  if (!a?.length) return '';
  if (a.length === 1) return a[0];
  if (a.length === 2) return `${a[0]}, ${a[1]}`;
  return `${a.slice(0, -1).join(', ')}, ${a[a.length - 1]}`;
}

const publications = computed<Pub[]>(() => {
  const list = (cv.value?.publications ?? []).slice() as Pub[];
  const ts = (d?: string) => (d ? Date.parse(d.length === 4 ? `${d}-01-01` : d) : -Infinity);
  list.sort((a, b) => ts(b.releaseDate) - ts(a.releaseDate));
  return list;
});

const education = computed(() => {
  const list = (cv.value?.education ?? []).slice();
  const ts = (s?: string | null) => (s ? Date.parse(s.length === 4 ? `${s}-01-01` : s) : -Infinity);
  list.sort((a: any, b: any) => {
    const as = ts(a.startDate), bs = ts(b.startDate);
    if (as !== bs) return bs - as;
    const ae = ts(a.endDate), be = ts(b.endDate);
    return (be || Infinity) - (ae || Infinity);
  });
  return list;
});

const work = computed(() => {
  const w = (cv.value?.work ?? []).slice();
  const ts = (s?: string | null) => (s ? Date.parse(s.length === 4 ? `${s}-01-01` : s) : -Infinity);
  w.sort((a: any, b: any) => {
    const as = ts(a.startDate), bs = ts(b.startDate);
    if (as !== bs) return bs - as;
    const ae = ts(a.endDate), be = ts(b.endDate);
    return (be || Infinity) - (ae || Infinity);
  });
  return w;
});
</script>

<template>
    <!-- Education -->
    <section>
      <h2 class="text-lg font-semibold tracking-tight">Education</h2>
      <div class="mt-3 grid gap-y-4">
        <div v-for="ed in education" :key="ed.institution + (ed.startDate || '')" class="grid grid-cols-[9rem,1fr] gap-x-4">
          <div class="text-slate-500 tabular-nums">{{ fmtRangeCompact(ed.startDate, ed.endDate) }}</div>
          <div>
            <p>
              <span class="font-medium">{{ ed.studyType }}</span>
              <span v-if="ed.area">, {{ ed.area }}</span>
              <span v-if="ed.institution"> — {{ ed.institution }}</span>.
            </p>
            <ul v-if="ed['x-degrees']?.length" class="list-disc ms-5 mt-1 space-y-1">
              <li v-for="deg in ed['x-degrees']" :key="deg.level + deg.area">
                <span class="font-medium">{{ deg.level }}</span>
                <span v-if="deg.area"> — {{ deg.area }}</span>
                <span v-if="deg.startDate || deg.endDate" class="text-slate-500">
                  ({{ fmtRangeCompact(deg.startDate, deg.endDate) }})
                </span>
              </li>
            </ul>
            <div v-if="ed.courses?.length" class="mt-1 text-slate-700">
              Courses: {{ ed.courses.join(', ') }}
            </div>
          </div>
        </div>
      </div>
    </section>

    <div class="border-t border-slate-100 mt-10 pt-6"></div>

    <!-- Preprints & Publications -->
    <section>
      <h2 class="text-lg font-semibold tracking-tight">Preprints &amp; Publications</h2>
      <div class="mt-3 grid gap-y-4">
        <div v-for="pub in publications" :key="pub.name" class="grid grid-cols-[9rem,1fr] gap-x-4">
          <div class="text-slate-500 tabular-nums">
            <span v-if="pub.releaseDate">{{ yearOf(pub.releaseDate) }}</span>
          </div>
          <p>
            <span class="text-slate-700">{{ joinAuthors(pub.authors) }}.</span>
            <span class="font-semibold"> {{ pub.name }}</span>.
            <template v-if="pub.publisher || pub['x-venuePublisher']">
              <em>, {{ pub['x-venuePublisher'] || pub.publisher }}</em>
            </template>
            <template v-if="pub.volume">
              , <span class="font-semibold">{{ pub.volume }}</span>
            </template>
            <template v-if="pub.issue"> ({{ pub.issue }})</template>
            <template v-if="pub.pages">, {{ pub.pages }}</template>
            <template v-if="pub['x-status'] === 'preprint'">
              <span class="text-slate-500"> (preprint)</span>
            </template>
            <template v-if="pub.url">
              . <a :href="pub.url" target="_blank" rel="noopener" class="underline text-slate-700 hover:text-slate-900">{{ pub.url }}</a>
            </template>
          </p>
        </div>
      </div>
    </section>

    <div class="border-t border-slate-100 mt-10 pt-6"></div>

    <!-- Teaching -->
    <section>
      <h2 class="text-lg font-semibold tracking-tight">Teaching</h2>
      <div class="mt-3 grid gap-y-3">
        <div v-for="t in teaching" :key="(t.course || '') + (t.startDate || '')" class="grid grid-cols-[9rem,1fr] gap-x-4">
          <div class="text-slate-500 tabular-nums">{{ fmtRangeCompact(t.startDate, t.endDate) }}</div>
          <p>
            <span class="font-medium">{{ t.role }}</span>
            <span v-if="t.course"> in “{{ t.course }}”</span>
            <span v-if="t.level">, {{ t.level }} Level</span>
            <span v-if="t.institution">, {{ t.institution }}</span>
            <span v-if="t['x-status']"> ({{ t['x-status'] }})</span>.
            <p v-if="t.description"> {{ t.description }}</p>
            <template v-if="t.url">
              <a :href="t.url" target="_blank" rel="noopener" class="underline text-slate-700 hover:text-slate-900"> Link</a>
            </template>
          </p>
        </div>
      </div>
    </section>

    <div class="border-t border-slate-100 mt-10 pt-6"></div>

    <!-- Miscellaneous -->
    <section>
      <h2 class="text-lg font-semibold tracking-tight">Miscellaneous</h2>
      <div class="mt-3 grid gap-y-2">
        <div v-for="(m, i) in miscItems" :key="i" class="grid grid-cols-[9rem,1fr] gap-x-4">
          <!-- left date cell -->
          <div class="text-slate-500 tabular-nums">
            <template v-if="m.kind === 'service'">
              {{ fmtRangeCompact(m.startDate, m.endDate) }}
            </template>
            <template v-else>
              {{ fmtOne((m as any).date) }}
            </template>
          </div>
          <!-- right text cell -->
          <template v-if="m.kind === 'service'">
            <p><span>{{ m.role }}</span><span v-if="m.org">, {{ m.org }}</span></p>
          </template>
          <template v-else-if="m.kind === 'talk'">
            <p><span>{{ m.title }}</span><span v-if="m.location">, {{ m.location }}</span></p>
          </template>
          <template v-else>
            <p>
              Recipient of 
              <span>{{ m.title }}</span>
              <span v-if="m.awarder">, {{ m.awarder }}</span>
              <span v-if="m.summary"> — {{ m.summary }}</span>
            </p>
          </template>
        </div>
      </div>
    </section>

    <div class="border-t border-slate-100 mt-10 pt-6"></div>

    <!-- Employment -->
    <section>
      <h2 class="text-lg font-semibold tracking-tight">Employment</h2>
      <div class="mt-3 grid gap-y-5">
        <div v-for="w in work" :key="w.name + w.position + (w.startDate || '')" class="grid grid-cols-[9rem,1fr] gap-x-4">
          <div class="text-slate-500 tabular-nums">{{ fmtRangeCompact(w.startDate, w.endDate) }}</div>
          <div>
            <p class="font-medium">
              {{ w.name }} <span v-if="w.location" class="text-slate-500">, {{ w.location }}</span>
            </p>
            <p class="italic">{{ w.position }}</p>
            <p v-if="w.summary" class="mt-1">{{ w.summary }}</p>
            <ul v-if="w.highlights?.length" class="list-disc ms-5 mt-1 space-y-1">
              <li v-for="h in w.highlights" :key="h">{{ h }}</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
</template>
