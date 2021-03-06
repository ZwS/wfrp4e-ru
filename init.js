Hooks.once('ready', () => {
    patchConstants();
    patchLanguageSpecificMethods();
    loadTables();

    function patchLanguageSpecificMethods() {
        // Patch regex to support not only latin coin names
        game.wfrp4e.market.parseMoneyTransactionString = function (string) {
            //Regular expression to match any number followed by any abbreviation. Ignore whitespaces
            const expression = /((\d+)\s?(\p{L}+))/ug;
            let matches = [...string.matchAll(expression)];

            let payRecap = {
                gc: 0,
                ss: 0,
                bp: 0
            };
            let isValid = matches.length;
            for (let match of matches) {
                //Check if we have a valid command. We should have 4 groups per match
                if (match.length !== 4) {
                    isValid = false;
                    break;
                }
                //Should contains the abbreviated money (like "gc")
                switch (match[3].toLowerCase()) {
                    case game.i18n.localize("MARKET.Abbrev.GC").toLowerCase():
                        payRecap.gc += parseInt(match[2], 10);
                        break;
                    case game.i18n.localize("MARKET.Abbrev.SS").toLowerCase():
                        payRecap.ss += parseInt(match[2], 10);
                        break;
                    case game.i18n.localize("MARKET.Abbrev.BP").toLowerCase():
                        payRecap.bp += parseInt(match[2], 10);
                        break;
                }
            }
            if (isValid && (payRecap.gc + payRecap.ss + payRecap.bp === 0))
                isValid = false;
            if (isValid && (payRecap.gc + payRecap.ss + payRecap.bp === 0))
                isValid = false;
            return isValid ? payRecap : false;
        }
    }

    function patchConstants() {
        const WFRP4E = {};

        // Species
        WFRP4E.species = {
            "human": "Человек",
            "dwarf": "Гном",
            "halfling": "Полурослик",
            "helf": "Высший эльф",
            "welf": "Лесной эльф",
        };

        WFRP4E.speciesSkills = {
            "human": [
                "Усмирение животных",
                "Обаяние",
                "Хладнокровие",
                "Оценка",
                "Сплетничество",
                "Торговля",
                "Язык (Бретонский)",
                "Язык (Wastelander)",
                "Лидерство",
                "Знание (Рейкланд)",
                "Рукопашное (Основное)",
                "Дальнобойное (Лук)"
            ],
            "dwarf": [
                "Кутёж",
                "Хладнокровие",
                "Стойкость",
                "Артистизм (Cказительство)",
                "Оценка",
                "Запугивание",
                "Язык (Khazalid)",
                "Знание (Гномы)",
                "Знание (Geology)",
                "Знание (Metallurgy)",
                "Рукопашное (Основное)",
                "Ремесло (одно любое)"
            ],
            "halfling": [
                "Обаяние",
                "Кутёж",
                "Уклонение",
                "Азартные игры",
                "Торговля",
                "Интуиция",
                "Язык (Mootish)",
                "Знание (Рейкланд)",
                "Наблюдательность",
                "Ловкость рук",
                "Скрытность (Любое)",
                "Ремесло (Cook)"
            ],
            "helf": [
                "Хладнокровие",
                "Артистизм (Sing)",
                "Оценка",
                "Язык (Эльтарин)",
                "Лидерство",
                "Рукопашное (Основное)",
                "Ориентирование",
                "Наблюдательность",
                "Музицирование (одно любое)",
                "Дальнобойное (Лук)",
                "Хождение под парусом",
                "Плаванье"
            ],
            "welf": [
                "Атлетика",
                "Лазание",
                "Стойкость",
                "Артистизм (Sing)",
                "Запугивание",
                "Язык (Эльтарин)",
                "Рукопашное (Основное)",
                "Выживание",
                "Наблюдательность",
                "Дальнобойное (Лук)",
                "Скрытность (Rural)",
                "Выслеживание"
            ],
        }

        WFRP4E.speciesTalents = {
            "human": [
                "Роковое Пророчество",
                "Смекалка, Учтивый",
                3
            ],
            "dwarf": [
                "Устойчивость к магии",
                "Сумеречное зрение",
                "Грамотность, Неостановимый",
                "Целеустремлённый, Сильный духом",
                "Бугай",
                0
            ],
            "halfling": [
                "Обострённое восприятие (Вкус)",
                "Сумеречное зрение",
                "Устойчивость (Хаос)",
                "Малыш",
                2
            ],
            "helf": [
                "Обострённое восприятие (Зрение)",
                "Самообладание, Смекалка",
                "Сумеречное зрение",
                "Второе зрение, Шестое чувство",
                "Грамотность",
                0
            ],
            "welf": [
                "Обострённое восприятие (Зрение)",
                "Стойкий, Второе зрение",
                "Сумеречное зрение",
                "Грамотность, Закалка",
                "Скиталец",
                0
            ]
        }

        // Weapon Group Descriptions
        WFRP4E.weaponGroupDescriptions = {
            "basic": "Основоное",
            "cavalry": "WFRP4E.GroupDescription.Cavalry",
            "fencing": "Фехтовальное",
            "brawling": "Кулачное",
            "flail": "WFRP4E.GroupDescription.Flail",
            "parry": "WFRP4E.GroupDescription.Parry",
            "polearm": "Древковое",
            "twohanded": "Two-Handed",
            "blackpowder": "WFRP4E.GroupDescription.Blackpowder",
            "bow": "Лук",
            "crossbow": "WFRP4E.GroupDescription.Crossbow",
            "entangling": "Entangling",
            "engineering": "WFRP4E.GroupDescription.Engineering",
            "explosives": "WFRP4E.GroupDescription.Explosives",
            "sling": "Праща",
            "throwing": "WFRP4E.GroupDescription.Throwing",
        };

        WFRP4E.symptoms = {
            "blight": "Blight",
            "buboes": "Buboes",
            "convulsions": "Convulsions",
            "coughsAndSneezes": "Coughs and Sneezes",
            "fever": "Fever",
            "flux": "Flux",
            "gangrene": "Gangrene",
            "lingering": "Lingering",
            "malaise": "Malaise",
            "nausea": "Nausea",
            "pox": "Pox",
            "wounded": "Wounded",
            "delirium": "Delirium",
            "swelling": "Swelling"
        }

        for (let obj in WFRP4E) {
            for (let el in WFRP4E[obj]) {
                if (typeof WFRP4E[obj][el] === "string") {
                    WFRP4E[obj][el] = game.i18n.localize(WFRP4E[obj][el])
                }
            }
        }

        mergeObject(game.wfrp4e.config, WFRP4E);
    }

    function loadTables() {
        // load tables from system folder
        FilePicker.browse("data", "modules/wfrp4e-ru/tables").then(resp => {
            try {
                if (resp.error)
                    throw ""
                for (var file of resp.files) {
                    try {
                        if (!file.includes(".json"))
                            continue
                        let filename = file.substring(file.lastIndexOf("/") + 1, file.indexOf(".json"));
                        fetch(file).then(r => r.json()).then(async records => {
                            game.wfrp4e.tables[filename] = records;
                        })
                    }
                    catch (error) {
                        console.error("Error reading " + file + ": " + error)
                    }
                }
            }
            catch
            {
                // Do nothing
            }
        })
    }
});