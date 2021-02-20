// Babele registration
Hooks.once('init', () => {
	if (game.system.id == "wfrp4e") {
		Babele.get().register({
			module: 'wfrp4e-ru',
			lang: 'ru',
			dir: 'compendium'
		});
		
		Babele.get().registerConverters({
			"trapping_proprties": (value) => {
				if (value) { 
					var re = /(?<property>[^ ]+)(?<rank> \d+)?/i;
					return value.split(",")
							.map(property => {
								property = property.trim();
								property = property == "Trap Blade" ? "TrapBlade" : property;

								var match = re.exec(property);
								return game.i18n.localize("PROPERTY." + match.groups.property) + (match.groups.rank || "");
							})
							.toString();
				}
			}
		});
	}
});
