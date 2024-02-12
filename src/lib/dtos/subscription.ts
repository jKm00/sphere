export type SingleSubscriptionDto = {
	id: string;
	company: string;
	description: string;
	amount: number;
	currency: string;
	period: string;
	type: string;
	url: string;
};

export type SubscriptionsDto = {
	data: SingleSubscriptionDto[];
	totalItems: number;
	page: number;
	pageSize: number;
};
