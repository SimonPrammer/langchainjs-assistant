export const load = async (event) => {
	const isEnvSet = !!process.env.OPENAI_API_KEY;

	return {
		isEnvSet
	};
};
