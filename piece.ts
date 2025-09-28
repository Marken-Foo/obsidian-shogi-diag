import type { Piece, PieceType } from "types";

export function kanjiFromPiece(piece: Piece): string {
	return kanjiFromPieceType(piece.pieceType);
}

function kanjiFromPieceType(pieceType: PieceType): string {
	switch (pieceType) {
		case "FU":
			return "歩";
		case "KY":
			return "香";
		case "KE":
			return "桂";
		case "GI":
			return "銀";
		case "KI":
			return "金";
		case "KA":
			return "角";
		case "HI":
			return "飛";
		case "OU":
			return "玉";
		case "TO":
			return "と";
		case "NY":
			return "杏";
		case "NK":
			return "圭";
		case "NG":
			return "全";
		case "UM":
			return "馬";
		case "RY":
			return "龍";
	}
}

export function unpromotedPieceTypeFromSfen(c: string): PieceType | null {
	switch (c.toUpperCase()) {
		case "P":
			return "FU";
		case "L":
			return "KY";
		case "N":
			return "KE";
		case "S":
			return "GI";
		case "G":
			return "KI";
		case "B":
			return "KA";
		case "R":
			return "HI";
		case "K":
			return "OU";
		default:
			return null;
	}
}

export function promotedPieceTypeFromSfen(c: string): PieceType | null {
	switch (c.toUpperCase()) {
		case "+P":
			return "TO";
		case "+L":
			return "NY";
		case "+N":
			return "NK";
		case "+S":
			return "NG";
		case "+B":
			return "UM";
		case "+R":
			return "RY";
		default:
			return null;
	}
}
