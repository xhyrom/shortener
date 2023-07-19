import { vitePreprocess } from "@astrojs/svelte";

export default {
  preprocess: vitePreprocess(),
	ccompilerOptions: {
		dev: true
	}
};