export default defineEventHandler(async (event) => {
	const body = await readBody(event);
	const credentials = {
		grantType: body.grantType,
		clientId: body.clientId,
		clientSecret: body.clientSecret,
		tokenAddress: body.tokenAddress,
	};
	(global as any).credentials = credentials;
});
