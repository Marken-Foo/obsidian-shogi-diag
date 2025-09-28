import { setBoardColor, setHandBackgroundColor } from "diagram";
import type ShogiDiagPlugin from "main";
import { type App, PluginSettingTab, Setting } from "obsidian";

type PieceStyle = "zh_text" | "international";

export type ShogiDiagPluginSettings = {
	pieceStyle: PieceStyle;
	boardColor: string;
	handBackgroundColor: string;
};

export const DEFAULT_SETTINGS: Partial<ShogiDiagPluginSettings> = {
	pieceStyle: "zh_text",
	boardColor: "#ffd39b",
	handBackgroundColor: "#ffad76",
};

export class ShogiDiagSettingTab extends PluginSettingTab {
	plugin: ShogiDiagPlugin;

	constructor(app: App, plugin: ShogiDiagPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;
		containerEl.empty();
		new Setting(containerEl)
			.setName("Piece style")
			.setDesc("The type of pieces that will be used in the diagram.")
			.addDropdown((dropdown) =>
				dropdown
					.addOption("zh_text", "Chinese font characters")
					.addOption("international", "Internationalised symbols")
					.setValue(this.plugin.settings.pieceStyle)
					.onChange(async (value: PieceStyle) => {
						this.plugin.settings.pieceStyle = value;
						await this.plugin.saveSettings();
					}),
			);
		new Setting(containerEl)
			.setName("Board color")
			.setDesc("Color of the board background.")
			.addColorPicker((color) =>
				color
					.setValue(this.plugin.settings.boardColor)
					.onChange(async (value: string) => {
						this.plugin.settings.boardColor = value;
						await this.plugin.saveSettings();
						setBoardColor(value);
					}),
			);

		new Setting(containerEl)
			.setName("Hand background color")
			.setDesc("Color of the hand background.")
			.addColorPicker((color) =>
				color
					.setValue(this.plugin.settings.handBackgroundColor)
					.onChange(async (value: string) => {
						this.plugin.settings.handBackgroundColor = value;
						await this.plugin.saveSettings();
						setHandBackgroundColor(value);
					}),
			);
	}
}
