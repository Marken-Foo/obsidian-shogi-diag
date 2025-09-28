import {
	setBoardColor,
	setHandBackgroundColor,
	shogiDiagHandler,
	unsetBoardColor,
	unsetHandBackgroundColor,
} from "diagram";
import { Plugin } from "obsidian";
import {
	DEFAULT_SETTINGS,
	type ShogiDiagPluginSettings,
	ShogiDiagSettingTab,
} from "settings";

export default class ShogiDiagPlugin extends Plugin {
	settings: ShogiDiagPluginSettings;

	async onload() {
		await this.loadSettings();
		this.addSettingTab(new ShogiDiagSettingTab(this.app, this));
		setBoardColor(this.settings.boardColor);
		setHandBackgroundColor(this.settings.handBackgroundColor);
		this.registerMarkdownCodeBlockProcessor("shogi-diag", shogiDiagHandler);
	}

	async loadSettings() {
		this.settings = { ...DEFAULT_SETTINGS, ...(await this.loadData()) };
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}

	onunload(): void {
		unsetBoardColor();
		unsetHandBackgroundColor();
	}
}
