import React, { ReactNode, ReactElement, useEffect } from 'react';
import styled from 'styled-components';

import { Sprite, drawGrid } from '../../helpers';

const PanelWrapper = styled.section<{ width: number }>`
	background-color: black;
	margin: auto;
	max-width: 100vh;
	& > canvas {
		width: 100%;
	}
`;

type TexturePreviewProps = {
	files: Sprite[];
	textureSize: number;
	paddingSize: number;
	children?: ReactNode;
};

export default function TexturePreview(props: TexturePreviewProps): ReactElement {
	useEffect(() => {
		const ctx = drawGrid(props.textureSize, 16);
		for (const file of props.files) {
			if (file.rect)
				ctx.drawImage(file.image, file.rect.x + props.paddingSize, file.rect.y + props.paddingSize);
		}
	});

	return (
		<PanelWrapper width={props.textureSize}>
			<canvas className="preview-canvas"></canvas>
		</PanelWrapper>
	);
}
