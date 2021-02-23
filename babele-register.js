Hooks.once('init', () => {
    let compendium = "wfrp4e";
    game.modules.forEach((module, name) => {
        if (name === "wfrp4e-core" && module.active) {
            compendium = "wfrp4e-core";
        }
    });

    if (game.system.id === "wfrp4e") {
        Babele.get().register({
            module: 'wfrp4e-ru',
            lang: 'ru',
            dir: 'compendium'
        });

        Babele.get().registerConverters({
            "trapping_properties": (properties) => {
                if (properties) {
                    let re = /(?<property>[^ ]+)(?<rank> \d+)?/i;
                    return properties.split(",")
                        .map(property => {
                            property = property.trim();
                            property = property === "Trap Blade" ? "TrapBlade" : property;

                            let match = re.exec(property);
                            return game.i18n.localize("PROPERTY." + match.groups.property) + (match.groups.rank || "");
                        })
                        .toString();
                }
            },
            "talent_effects": (effects) => {
                if (effects) {
                    const fullTalents = game.packs.get('wfrp4e-core.talents');
                    return effects.map(effect => {
                        effect.label = fullTalents.translate({ name: effect.label }).name;
                        return effect;
                    });
                }
            },
            "npc_characteristics": (chars) => {
                for (let key in chars) {
                    let char = chars[key];
                    let abrev = char.abrev;

                    // Some of NPCs have localization keys in their characteristics, meanwhile others don't
                    // This will patch NPCs that don't utilize translation keys
                    if (!abrev.includes("CHARAbbrev.")) {
                        char.label = "CHAR." + abrev;
                        char.abrev = "CHARAbbrev." + abrev;
                    }
                }

                return chars;
            },
            "npc_traits": (npcTraits) => {
                const fullTraits = game.packs.get('wfrp4e-core.traits') || {};
                const fullSkills = game.packs.get(compendium === "wfrp4e" ? 'wfrp4e.basic' : 'wfrp4e-core.skills');
                const fullTalents = game.packs.get('wfrp4e-core.talents') || {};
                const fullCareers = game.packs.get('wfrp4e-core.careers') || {};
                const fullTrappings = game.packs.get(compendium === "wfrp4e" ? 'wfrp4e.basic' : 'wfrp4e-core.skills');
                const fullSpells = game.packs.get('wfrp4e-core.spells') || {};
                const fullPrayers = game.packs.get('wfrp4e-core.prayers') || {};

                for (let originalTrait of npcTraits) {
                    let parsedTrait = parseTraitName(originalTrait.name);

                    if (originalTrait.type === "trait" && fullTraits.translate) {
                        let translatedTrait = fullTraits.translate({name: parsedTrait.baseName});
                        originalTrait.name = parsedTrait.tentacles + translatedTrait.name + parsedTrait.special;
                        if (translatedTrait.data && translatedTrait.data.description && translatedTrait.data.description.value) {
                            originalTrait.data.description.value = translatedTrait.data.description.value;
                        }

                        if (isNaN(originalTrait.data.specification.value)) { // This is a string, so translate it
                            originalTrait.data.specification.value = game.i18n.localize(originalTrait.data.specification.value.trim());
                        }
                    } else if (originalTrait.type === "skill" && fullSkills.translate) {
                        let translatedTrait = fullSkills.translate({name: parsedTrait.baseName});
                        originalTrait.name = translatedTrait.name + parsedTrait.special;
                        if (translatedTrait.data) {
                            originalTrait.data.description.value = translatedTrait.data.description.value;
                        }
                    } else if (originalTrait.type === "prayer" && fullPrayers.translate) {
                        let translatedTrait = fullPrayers.translate({name: parsedTrait.baseName});
                        originalTrait.name = translatedTrait.name + parsedTrait.special;
                        if (translatedTrait.data && translatedTrait.data.description && translatedTrait.data.description.value)
                            originalTrait.data.description.value = translatedTrait.data.description.value;
                    } else if (originalTrait.type === "spell" && fullSpells.translate) {
                        let translatedTrait = fullSpells.translate({name: parsedTrait.baseName});
                        originalTrait.name = translatedTrait.name + parsedTrait.special;
                        if (translatedTrait.data && translatedTrait.data.description && translatedTrait.data.description.value)
                            originalTrait.data.description.value = translatedTrait.data.description.value;
                    } else if (originalTrait.type === "talent" && fullTalents.translate) {
                        let translatedTrait = fullTalents.translate({name: parsedTrait.baseName});
                        originalTrait.name = translatedTrait.name + parsedTrait.special;
                        if (translatedTrait.data && translatedTrait.data.description && translatedTrait.data.description.value) {
                            originalTrait.data.description.value = translatedTrait.data.description.value;
                        }
                    } else if (originalTrait.type === "career" && fullCareers.translate) {
                        originalTrait = fullCareers.translate(originalTrait);
                    } else if (originalTrait.type === "trapping"
                        || originalTrait.type === "weapon"
                        || originalTrait.type === "armour"
                        || originalTrait.type === "container"
                        || originalTrait.type === "money"
                        && fullTrappings.translate) {
                        let translatedTrapping = fullTrappings.translate(originalTrait);
                        originalTrait.name = translatedTrapping.name;
                        if (translatedTrapping.data) {
                            originalTrait.data.description = translatedTrapping.data.description;
                        }
                    }
                }
                return npcTraits;
            },
        });
    }

    function parseTraitName(traitName) {
        traitName = traitName.trim();
        let parsedTrait = {
            "baseName": traitName,
            "special": "",
            "tentacles": ""
        };

        // Process specific Tentacles case
        if (traitName.includes("Tentacles")) {
            let res = /(?<tentacles>\d+)x Tentacles/i.exec(traitName);
            parsedTrait.baseName = "Tentacles";
            parsedTrait.tentacles = res.tentacles + "x ";
        }

        // Process specific skills name with (xxxx) inside
        if (traitName.includes("(") && traitName.includes(")")) {
            let res = /(.*) +\((.*)\)/i.exec(traitName);
            parsedTrait.baseName = res[1].trim();
            parsedTrait.special = " (" + game.i18n.localize(res[2].trim()) + ")";
        }

        return parsedTrait;
    }
});
