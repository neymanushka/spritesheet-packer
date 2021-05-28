import React, { ReactElement, ReactNode, useState } from 'react';
import styled from 'styled-components';

import { Sprite } from '../../helpers';

const FileListWrapper = styled.section`
	height: 100%;
	font-family: 'Roboto';
	overflow-y: auto;
	color: gray;
	background-color: white;
	user-select: none;
	line-height: 34px;
`;

const ItemWrapper = styled.div`
	position: relative;
	display: grid;
	grid-template-columns: 60% 30% 10%;
	border-bottom: 1px solid #edeff0;
	height: 36px;
	cursor: pointer;
`;

const FileName = styled.span<{ isFit: boolean }>`
	color: ${(props) => (props.isFit ? 'gray' : 'white')};
	background-color: ${(props) => (props.isFit ? 'white' : 'red')};
	padding-left: 5px;
	font-size: 14px;
	overflow: hidden;
`;

const RemoveButton = styled.span`
	text-align: center;
	&:hover {
		color: red;
	}
`;

const Tooltip = styled.span`
	position: absolute;
	background-color: yellow;
	padding: 4px;
	height: 16px;
	color: black;
	left: 20px;
	top: 20px;
	overflow: hidden;
	border: 1px solid black;
	border-radius: 4px;
	font-size: 14px;
	text-align: center;
	z-index: 999;
	line-height: initial;
`;

type ItemProps = { item: Sprite; onRemoveHandler: CallableFunction; children?: ReactNode };

const Item = (props: ItemProps): ReactElement => {
	const [isTooltipShow, setIsTooltipShow] = useState(false);
	const tooltipContent = `${props.item.image.width}px x ${props.item.image.height}px`;
	const fileSize =
		props.item.file.size > 1024
			? `${Math.round(props.item.file.size / 1024).toFixed(2)} Kb`
			: `${props.item.file.size} B`;

	return (
		<div
			style={{ position: 'relative' }}
			onMouseOver={() => setIsTooltipShow(true)}
			onMouseLeave={() => setIsTooltipShow(false)}
		>
			{isTooltipShow && <Tooltip>{tooltipContent}</Tooltip>}
			<ItemWrapper>
				<FileName isFit={!!props.item.rect}>{props.item.file.name}</FileName>
				<div>{fileSize}</div>
				<RemoveButton onClick={() => props.onRemoveHandler(props.item.file)}>&#10006;</RemoveButton>
			</ItemWrapper>
		</div>
	);
};

type FileListProps = {
	onRemoveHandler: CallableFunction;
	files: Sprite[];
	children?: ReactNode;
};

export default function FileList(props: FileListProps): ReactElement {
	return (
		<FileListWrapper>
			{!props.files.length ? (
				<div style={{ textAlign: 'center' }}>no files added</div>
			) : (
				props.files.map((item, i) => (
					<Item key={i} item={item} onRemoveHandler={props.onRemoveHandler} />
				))
			)}
		</FileListWrapper>
	);
}
