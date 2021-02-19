// Babele registration
Hooks.once('init', () => {
	if (game.system.id == "wfrp4e") {
		Babele.get().register({
			module: 'wfrp4e-ru',
			lang: 'ru',
			dir: 'compendium'
		});
	}
});
