import { SfenParser } from "sfenParser";
import { type MarkdownPostProcessorContext, parseYaml } from "obsidian";
import type { HandContents, PieceType, Side, Square } from "types";

type ShogiDiagArgs = {
	sfen: string;
	flip?: boolean;
};

export function shogiDiagHandler(
	source: string,
	el: HTMLElement,
	_ctx: MarkdownPostProcessorContext,
): void {
	const args: ShogiDiagArgs = parseYaml(source);
	const { sfen, flip = false } = args;
	if (sfen === undefined) {
		el.createDiv({ text: "Error: must provide SFEN in YAML `sfen:` field" });
		return;
	}

	const sfenParser = new SfenParser(sfen.trim());
	sfenParser.parseSfen();

	if (sfenParser.hasErrors()) {
		el.createDiv({ text: `Failed to parse SFEN: ${sfenParser.getErrors()}` });
		console.log(JSON.stringify(sfenParser));
		return;
	}

	const diagram = el.createDiv({ cls: "shogi_diag" });
	const leftHandContents = flip ? sfenParser.senteHand : sfenParser.goteHand;
	const leftHand = createHand(diagram, leftHandContents, true);
	leftHand.addClass("shogi_diag_left_hand");
	const board = diagram.createDiv({ cls: "shogi_diag_board" });
	const rightHandContents = flip ? sfenParser.goteHand : sfenParser.senteHand;
	const rightHand = createHand(diagram, rightHandContents, false);
	rightHand.addClass("shogi_diag_right_hand");

	for (const [sq, piece] of sfenParser.piecePositions.entries()) {
		const square = flip ? reflectSquareAboutCenter(sq) : sq;
		putPieceOnBoard(
			board,
			square,
			piece.pieceType,
			isSideUpsideDown(piece.side, flip),
		);
	}
}

function createHand(
	parent: HTMLDivElement,
	contents: HandContents,
	isUpsideDown: boolean,
): HTMLDivElement {
	const hand = parent.createDiv({ cls: "shogi_diag_hand" });
	const handPieces: PieceType[] = ["HI", "KA", "KI", "GI", "KE", "KY", "FU"];
	for (const pieceType of handPieces) {
		const thing = hand.createDiv({ cls: ["shogi_diag_piece_and_amount"] });
		createPiece(thing, pieceType, isUpsideDown);
		const amount = contents.get(pieceType) ?? 0;
		thing.createDiv({ text: amount.toString(), cls: ["shogi_diag_amount"] });
	}
	return hand;
}

export function setBoardColor(color: string): void {
	document.body.style.setProperty("--shogi-diag-board-color", color);
}

export function unsetBoardColor(): void {
	document.body.style.removeProperty("--shogi-diag-board-color");
}

export function setHandBackgroundColor(color: string): void {
	document.body.style.setProperty("--shogi-diag-hand-background-color", color);
}

export function unsetHandBackgroundColor(): void {
	document.body.style.removeProperty("--shogi-diag-hand-background-color");
}

function putPieceOnBoard(
	board: HTMLDivElement,
	sq: Square,
	pieceType: PieceType,
	isUpsideDown: boolean,
): void {
	const xTranslate = 100 * (9 - sq.col);
	const yTranslate = 100 * (sq.row - 1);
	const pieceContainer = board.createDiv({
		cls: ["shogi_diag_square_container"],
	});
	createPiece(pieceContainer, pieceType, isUpsideDown);
	pieceContainer.style.setProperty(
		"transform",
		`translate(${xTranslate}%, ${yTranslate}%)`,
	);
}

function createPiece(
	parent: HTMLDivElement,
	pieceType: PieceType,
	isUpsideDown: boolean,
) {
	parent.createDiv({
		cls: ["shogi_diag_piece", pieceClass(pieceType, isUpsideDown)],
	});
}

function pieceClass(pieceType: PieceType, isFlipped: boolean): string {
	return `shogi_diag_${isFlipped ? "1" : "0"}${csaFromPieceType(pieceType)}`;
}

function csaFromPieceType(pieceType: PieceType): string {
	return pieceType;
}

function isSideUpsideDown(side: Side, isBoardFlipped: boolean): boolean {
	switch (side) {
		case "sente":
			return isBoardFlipped;
		case "gote":
			return !isBoardFlipped;
	}
}

function reflectSquareAboutCenter(sq: Square): Square {
	return { col: 10 - sq.col, row: 11 - sq.row };
}
