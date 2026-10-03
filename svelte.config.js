import adapter from '@sveltejs/adapter-static';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	
	kit: {
		// adapter-auto only supports some environments, see https://svelte.dev/docs/kit/adapter-auto for a list.
		// If your environment is not supported, or you settled on a specific environment, switch out the adapter.
		// See https://svelte.dev/docs/kit/adapters for more information about adapters.
		adapter: adapter({
			// default options are shown. On some platforms
			// these options are set automatically — see below
			pages: 'build',
			assets: 'build',
			fallback: 'index.html',
			precompress: false,
			strict: false
		}),
		prerender:{
			entries:[
				"/",
				"/inicio",
				"/login",
				"/agrupamientos",
				"/agrupamientos/1",
				"/clientes",
				"/clientes/1",
				"/egreso",
				"/controles",
				"/controles/multiples",
				"/controles/1",
				"/destinatarios/1",
				"/destinatarios",
				"/ingreso",
				"/loteqr",
				"/leerqr",
				"/lotes",
				"/historial",
				"/lotes/1",
				"/movimientos",
				"/movimientos/1",
				"/productos",
				"/productos/1",
				"/unidades",
				"/usuarios",
				"/usuarios/1",
			]
		}
	}
};

export default config;
