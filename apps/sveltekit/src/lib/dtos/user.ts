export type UserDto = {
	id: string;
	prefferedCurrency: string;
	prefferedPeriod: string;
	email: string | null;
	username?: string | null;
};

export type GitHubUser = {
	id: number;
	login: string;
};

export type GoogleUser = {
	sub: string;
	name: string;
	given_name: string;
	family_name: string;
	picture: string;
	email: string;
	email_verified: boolean;
	locale: string;
};
