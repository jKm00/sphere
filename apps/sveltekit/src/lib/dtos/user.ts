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
