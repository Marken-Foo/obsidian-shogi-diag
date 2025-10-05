import { promotedPieceTypeFromSfen, unpromotedPieceTypeFromSfen } from "piece";
import type { HandContents, Piece, PiecePositions, Side } from "types";

const BOARD_NUM_ROWS = 9;
const BOARD_NUM_COLS = 9;

class InputState {
	raw: string;
	fullLength: number;
	pos: number;

	constructor(str: string) {
		this.raw = str;
		this.fullLength = str.length;
		this.pos = 0;
	}

	advance(): void {
		this.pos += 1;
	}

	advanceN(n: number): void {
		this.pos += n;
	}

	peek(): string | null {
		return this.raw.charAt(this.pos) || null;
	}

	peekN(n: number): string | null {
		return this.raw.substring(this.pos, this.pos + n);
	}

	takeWhile(predicate: (c: string) => boolean): string {
		const start = this.pos;
		let c = this.peek();
		while (c !== null && predicate(c)) {
			this.advance();
			c = this.peek();
		}
		return this.raw.slice(start, this.pos);
	}
}

export class SfenParser {
	input: InputState;
	piecePositions: PiecePositions;
	senteHand: HandContents;
	goteHand: HandContents;
	sideToMove: Side | null;
	errors: string[];

	constructor(fen: string) {
		this.input = new InputState(fen);
		this.piecePositions = new Map();
		this.senteHand = new Map();
		this.goteHand = new Map();
		this.sideToMove = null;
		this.errors = [];
	}

	hasErrors(): boolean {
		return this.errors.length > 0;
	}

	getErrors(): string[] {
		return this.errors;
	}

	parseSfen() {
		this.parsePosition();
		this.skipWhitespace();
		this.parseSideToMove();
		this.skipWhitespace();
		this.parseHands();
		this.skipWhitespace();
		this.parseMoveNum();
		if (this.input.peek() !== null) {
			this.errors.push(`Expected EOF, got ${this.input.peek()}`);
		}
	}

	parsePosition() {
		for (let rowNum = 1; rowNum < BOARD_NUM_ROWS; rowNum++) {
			this.parseRow(rowNum);
			this.parseSlash();
		}
		this.parseRow(BOARD_NUM_ROWS);
	}

	parseRow(rowNum: number) {
		let colNum = BOARD_NUM_COLS;
		while (true) {
			const piece = this.parsePiece();
			if (piece !== null) {
				if (colNum < 1) {
					this.errors.push(`Too many squares in row ${rowNum}`);
					this.input.takeWhile((c) => c !== "/" && c !== " ");
					return;
				}
				this.piecePositions.set({ col: colNum, row: rowNum }, piece);
				colNum -= 1;
				continue;
			}
			const gaps = this.parseInt();
			if (gaps !== null) {
				colNum -= gaps;
				if (colNum < 0) {
					this.errors.push(`Too many squares in row ${rowNum}`);
					this.input.takeWhile((c) => c !== "/" && c !== " ");
					return;
				}
				continue;
			}
			return;
		}
	}

	parseSlash() {
		const c = this.input.peek();
		if (c !== "/") {
			this.errors.push(`Expected '/', found '${c}'`);
			return;
		}
		this.input.advance();
	}

	skipWhitespace() {
		let c = this.input.peek();
		while (c === " " || c === "\t" || c === "\n") {
			this.input.advance();
			c = this.input.peek();
		}
	}

	parseSideToMove(): Side | null {
		const c = this.input.peek();
		switch (c) {
			case "w":
				this.sideToMove = "sente";
				this.input.advance();
				return "sente";
			case "b":
				this.sideToMove = "gote";
				this.input.advance();
				return "gote";
			default:
				return null;
		}
	}

	parsePlySinceLastCapture() {
		this.parseInt();
	}

	parseMoveNum() {
		this.parseInt();
	}

	parseInt(): number | null {
		const s = this.input.takeWhile(isAsciiDigit);
		const n = Number.parseInt(s, 10);
		return Number.isNaN(n) ? null : n;
	}

	parsePiece(): Piece | null {
		const c = this.input.peek();
		if (c === null) {
			return null;
		}
		return c === "+" ? this.parsePromotedPiece() : this.parseUnpromotedPiece();
	}

	parseUnpromotedPiece(): Piece | null {
		const c = this.input.peek();
		if (c === null) {
			return null;
		}
		const pieceType = unpromotedPieceTypeFromSfen(c);
		if (pieceType === null) {
			return null;
		}
		const side = isAsciiUppercase(c) ? "sente" : "gote";
		this.input.advance();
		return { side, pieceType };
	}

	parsePromotedPiece(): Piece | null {
		const pieceStr = this.input.peekN(2);
		if (pieceStr === null || pieceStr === "+") {
			return null;
		}
		const pieceType = promotedPieceTypeFromSfen(pieceStr);
		if (pieceType === null) {
			return null;
		}
		const side = isAsciiUppercase(pieceStr.substring(1)) ? "sente" : "gote";
		this.input.advanceN(2);
		return { side, pieceType };
	}

	parseHands(): void {
		const next = this.input.peek();
		if (next === "-") {
			this.senteHand = new Map();
			this.goteHand = new Map();
			this.input.advance();
			return;
		}
		let piece: Piece | null = null;
		while (true) {
			const amount = this.parseInt() ?? 1;
			piece = this.parsePiece();
			if (piece === null) {
				break;
			}
			const hand = piece.side === "sente" ? this.senteHand : this.goteHand;
			hand.set(piece.pieceType, amount);
		}
	}
}

function isAsciiDigit(c: string): boolean {
	const code = c.charCodeAt(0);
	return !Number.isNaN(code) && 48 <= code && code <= 57;
}

function isAsciiUppercase(c: string): boolean {
	const code = c.charCodeAt(0);
	return !Number.isNaN(code) && 65 <= code && code <= 90;
}
