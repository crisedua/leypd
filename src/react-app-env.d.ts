/// <reference types="react-scripts" />

declare namespace NodeJS {
	interface ProcessEnv {
		REACT_APP_SUPABASE_URL?: string
		REACT_APP_SUPABASE_ANON_KEY?: string
		REACT_APP_APP_NAME?: string
		REACT_APP_VERSION?: string
	}
}