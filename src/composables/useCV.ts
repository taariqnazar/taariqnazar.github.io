import { readonly, shallowRef } from 'vue';
import { load as parseYAML } from 'js-yaml';
import type { CV } from '@/types/cv';

// Import raw file contents at build time
import rawYaml from '../../cv.yaml?raw';

const cvRef = shallowRef<CV | null>(null);

export function useCv() {
  if (!cvRef.value) {
    // Parse once and cache
    const parsed = parseYAML(rawYaml) as unknown as CV;
    cvRef.value = parsed;
  }
  return readonly(cvRef); // expose as readonly shallowRef
}
