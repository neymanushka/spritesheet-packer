import React, { useState } from 'react';
import { render } from 'react-dom';
import styled from 'styled-components';

import FileList from './components/FileList';
import TexturePreview from './components/TexturePreview';
import Select from './components/Select';
import Input from './components/Input';
import OptionsPanel from './components/OptionsPanel';
import Button from './components/Button';

import { SpriteSheet, Sprite, readImageAsync, packSprites, saveFile } from './helpers';

const textureResolutionsList = {
	'256': 256,
	'512': 512,
	'1024': 1024,
	'2048': 2048,
};

const Main = styled.div`
	display: grid;
	grid-template-columns: 20% 60% 20%;
	grid-template-rows: 100vh;
`;

const App = () => {
	const [files, setFiles] = useState<Sprite[]>([]);
	const [textureSize, setTextureSize] = useState(256);
	const [paddingSize, setPaddingSize] = useState(0);

	const onRemoveHandler = (file: File) => {
		setFiles(
			packSprites(
				files.filter((sprite) => !(sprite.file === file)),
				textureSize,
				paddingSize
			)
		);
	};

	const dropHandler = async (event: React.DragEvent) => {
		event.preventDefault();
		const newFiles = [];
		for (const file of Array.from(event.dataTransfer.files)) {
			newFiles.push(readImageAsync(file));
		}
		const loadedFiles = await Promise.all(newFiles);
		const filtered = loadedFiles.filter((f) => !files.find((o) => o.file.name === f.file.name));
		setFiles(packSprites([...files, ...filtered], textureSize, paddingSize));
	};

	const onChangeTextureSizeHandler = (size: number) => {
		setTextureSize(size);
		setFiles(packSprites(files, size, paddingSize));
	};

	const onChangePaddingSizeHandler: React.ChangeEventHandler<HTMLInputElement> = (event) => {
		const padding = Number(event.target.value);
		setPaddingSize(padding);
		setFiles(packSprites(files, textureSize, padding));
	};

	const onSaveJsonHandler = () => {
		const spritesheet: SpriteSheet = {
			frames: {},
			meta: {
				app: 'https://neymanushka.github.io/spritesheet-packer/',
				image: 'spritesheet.png',
				size: { w: textureSize, h: textureSize },
				scale: 1,
				format: 'RGBA8888',
			},
		};
		for (const file of files) {
			if (file.rect) {
				const bounds = { w: file.image.width, h: file.image.height };
				spritesheet.frames[file.file.name] = {
					trimmed: false,
					rotated: false,
					frame: { x: file.rect.x + paddingSize, y: file.rect.y + paddingSize, ...bounds },
					spriteSourceSize: { x: 0, y: 0, ...bounds },
					sourceSize: bounds,
				};
			}
		}
		saveFile('spritesheet.json', 'application/json', JSON.stringify(spritesheet, null, 2));
	};

	const onSaveTextureHandler = () => {
		const canvas = document.createElement('canvas');
		canvas.width = textureSize;
		canvas.height = textureSize;
		const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
		ctx.clearRect(0, 0, textureSize, textureSize);
		for (const file of files) {
			if (file.rect)
				ctx.drawImage(file.image, file.rect.x + paddingSize, file.rect.y + paddingSize);
		}
		const type = 'image/png';
		canvas.toBlob((blob) => saveFile('spritesheet.png', type, blob), type);
	};

	return (
		<Main onDrop={dropHandler} onDragOver={(e) => e.preventDefault()}>
			<FileList files={files} onRemoveHandler={onRemoveHandler} />
			<TexturePreview files={files} textureSize={textureSize} paddingSize={paddingSize} />
			<OptionsPanel>
				<div style={{ padding: '5px 5px' }}>
					<Select
						label={'Texture size:'}
						value={textureSize}
						list={textureResolutionsList}
						onChange={onChangeTextureSizeHandler}
					/>
					<Input label={'Padding:'} value={paddingSize} onChange={onChangePaddingSizeHandler} />
				</div>
				<div
					style={{
						padding: '5px 5px',
						display: 'flex',
						flexFlow: 'nowrap row',
						justifyContent: 'space-around',
					}}
				>
					<Button onClick={onSaveJsonHandler}>Save json</Button>
					<Button onClick={onSaveTextureHandler}>Save texture</Button>
				</div>
			</OptionsPanel>
		</Main>
	);
};

render(<App />, document.getElementById('root') as HTMLElement);
