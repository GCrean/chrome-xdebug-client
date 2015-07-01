var Keyboard = (function() {

	var config_mode = false;
	var key_names = [];

	key_names[0x41] = "A";

	function get_key_name(key_code) {
		return key_names[key_code] || key_code;
	}


	var shortcuts = {

		step_into: {
			keyCode: 65,
			modifiers: {
				ctrlKey: false,
				altKey: false,
				shiftKey: false,
			}
		}

	};

	var settings_wrapper_selector = "#settings-shortcuts";


	function process_key_event(e) {
		if (config_mode) {
			shortcuts[config_mode] = e;
			publicMethods.refreshShortcuts();
			config_mode = false;
		} else {
			for (var action_name in shortcuts) {
				if (JSON.stringify(e) == JSON.stringify(shortcuts[action_name])) {
					Action.exec(action_name);
				}
			}
		}
	}


	function get_shortcut_string(action) {
		var s = shortcuts[action];
		if (s) {
			var shortcut_string = "";
			if (s.modifiers.ctrlKey) shortcut_string += "CTRL + ";
			if (s.modifiers.altKey) shortcut_string += "ALT + ";
			if (s.modifiers.shiftKey) shortcut_string += "SHIFT + ";
			shortcut_string += get_key_name(s.keyCode);
		}

		return shortcut_string;
	}




	var publicMethods = {

		init: function() {
			// populate shortcuts from storage

			$(function() {
				$("body").on("keyup", function(event) {
					var ke = {
						keyCode: event.keyCode,
						modifiers: {
							ctrlKey: event.ctrlKey,
							altKey: event.altKey,
							shiftKey: event.shiftKey
						}
					};
					process_key_event(ke);
				});

				$(settings_wrapper_selector).on("click", ".key", function() {
					config_mode = $(this).attr("ref");
					$(this).text("Press new key...");
				});
			});

			this.refreshShortcuts();
		},

		refreshShortcuts: function() {
			$(function() {
				var table = $(settings_wrapper_selector);
				table.html("");

				var tr = $("<tr/>");
				tr.append("<th>action</th>");
				tr.append("<th>shortcut</th>");
				table.append(tr);

				$("input[name=shortcuts]").val(JSON.stringify(shortcuts));

				var all_action_names = Action.getAllActionNames();
				for (var a in all_action_names) {
					var tr = $("<tr/>");
					tr.append("<td>" + a + "</td>");
					tr.append('<td ref="' + a + '" class="key">' + get_shortcut_string(a) + "</td>");
					table.append(tr);
				}
			});
		}

	}

	return publicMethods;

})();
