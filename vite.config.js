import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';
export default defineConfig({
	server:{
		//allowedHosts: ['511e-2803-9800-9887-4ba8-36b6-e8cc-9f32-1bce.ngrok-free.app']
		allowedHosts: ['75e8-2803-9800-9887-4ba8-e13e-ad0d-d2e1-501f.ngrok-free.app']
	},
	plugins: [tailwindcss(),sveltekit()]
});
