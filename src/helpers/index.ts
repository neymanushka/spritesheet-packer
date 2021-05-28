export type Rect = { x: number; y: number; w: number; h: number };

class Node {
	x: number;
	y: number;
	w: number;
	h: number;
	left: Node | null = null;
	right: Node | null = null;
	constructor(x: number, y: number, w: number, h: number) {
		this.x = x;
		this.y = y;
		this.w = w;
		this.h = h;
	}

	fit(rect: Rect): Rect | null {
		if (!this.left && rect.w <= this.w && rect.h <= this.h) return this.split(rect);
		else if (this.left && this.right) {
			return this.left.fit(rect) || this.right.fit(rect);
		}
		return null;
	}

	split(rect: Rect): Rect {
		if (this.w < this.h) {
			this.left = new Node(this.x + rect.w, this.y, this.w - rect.w, rect.h);
			this.right = new Node(this.x, this.y + rect.h, this.w, this.h - rect.h);
		} else {
			this.left = new Node(this.x, this.y + rect.h, rect.w, this.h - rect.h);
			this.right = new Node(this.x + rect.w, this.y, this.w - rect.w, this.h);
		}
		return { ...rect, x: this.x, y: this.y };
	}
}

export type Sprite = {
	file: File;
	image: HTMLImageElement;
	rect: Rect | null;
};

export type SpriteSheet = {
	frames: {
		[key: string]: {
			frame: { x: number; y: number; w: number; h: number };
			spriteSourceSize: { x: number; y: number; w: number; h: number };
			sourceSize: { w: number; h: number };
			trimmed: boolean;
			rotated: boolean;
		};
	};
	meta: {
		app: string;
		image: string;
		size: { w: number; h: number };
		scale: number;
		format: string;
	};
};

export const readImageAsync = (file: File): Promise<Sprite> => {
	return new Promise<Sprite>((resolve, reject) => {
		const reader = new FileReader();
		reader.onerror = (e) => reject(e);
		reader.onload = function () {
			const image = document.createElement('img');
			image.src = reader.result as string;
			image.onload = () => resolve({ file, image, rect: null });
			image.onerror = () => reject();
		};
		reader.readAsDataURL(file);
	});
};

export const saveFile = (filename: string, type: string, data: unknown): void => {
	const file = new Blob([data as BlobPart], { type });
	const a = document.createElement('a');
	const url = URL.createObjectURL(file);
	a.href = url;
	a.download = filename;
	document.body.appendChild(a);
	a.click();
	setTimeout(function () {
		document.body.removeChild(a);
		window.URL.revokeObjectURL(url);
	}, 0);
};

export const packSprites = (files: Sprite[], textureSize: number, padding = 0): Sprite[] => {
	const tree = new Node(0, 0, textureSize, textureSize);
	files.sort((a, b) => b.image.width * b.image.height - a.image.width * a.image.height);
	const newFiles: Sprite[] = [];
	for (const file of files) {
		const w = file.image.width + padding;
		const h = file.image.height + padding;
		const rect = tree.fit({ x: 0, y: 0, w, h });
		newFiles.push({ image: file.image, file: file.file, rect });
	}
	return newFiles.sort((a, b) => a.file.name.localeCompare(b.file.name));
};

export const drawGrid = (textureSize: number, squareSize: number): CanvasRenderingContext2D => {
	const canvas = document.querySelector('.preview-canvas') as HTMLCanvasElement;
	canvas.width = textureSize;
	canvas.height = textureSize;
	const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
	ctx.clearRect(0, 0, textureSize, textureSize);
	ctx.fillStyle = 'white';
	ctx.fillRect(0, 0, textureSize, textureSize);

	const rows = textureSize / squareSize;
	const cols = textureSize / squareSize;

	ctx.fillStyle = '#a7a4a2';

	for (let j = 0; j < rows; j++) {
		for (let i = 0; i < cols; i++) {
			if ((!(i % 2) && !(j % 2)) || (i % 2 && j % 2)) {
				ctx.fillRect(i * squareSize, j * squareSize, squareSize, squareSize);
			}
		}
	}
	return ctx;
};
