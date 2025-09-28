export type Side = "sente" | "gote";
export type PieceType =
	| "FU"
	| "KY"
	| "KE"
	| "GI"
	| "KI"
	| "KA"
	| "HI"
	| "OU"
	| "TO"
	| "NY"
	| "NK"
	| "NG"
	| "UM"
	| "RY";

export type Piece = {
	side: Side;
	pieceType: PieceType;
};

export type Square = {
	col: number;
	row: number;
};

export type PiecePositions = Map<Square, Piece>;
export type HandContents = Map<PieceType, number>;
