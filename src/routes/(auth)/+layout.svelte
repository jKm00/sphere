<main class="grid h-screen lg:grid-cols-2">
	<!-- Left side image -->
	<div class="max-lg:hidden">
		<img class="h-screen w-full object-cover" src="/images/login-background.jpg" alt="" />
	</div>
	<!-- Form -->
	<section class="flex h-full flex-col p-4">
		<header class="flex items-center">
			<a href="/" class="font-bold">Sphere</a>
		</header>
		<slot />
	</section>
</main>
