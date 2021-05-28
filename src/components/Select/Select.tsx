import React, {
	ReactElement,
	ReactNode,
	useState,
	useRef,
	MouseEventHandler,
	useEffect,
} from 'react';
import styled from 'styled-components';

const Item = styled.div`
	display: flex;
	flex-flow: wrap row;
	justify-content: space-between;
	font-family: Roboto;
	min-height: 38px;
	user-select: none;
	background-color: white;
	cursor: pointer;
	overflow: hidden;
	& > div {
		padding: 10px;
		box-sizing: border-box;
	}
`;

const HeaderWrapper = styled(Item)<{ disabled: boolean }>`
	border: 2px solid gray;
	border-radius: 4px;
	pointer-events: ${(props) => (props.disabled ? 'none' : 'auto')};
	opacity: ${(props) => (props.disabled ? 0.4 : 1)};
`;

const Header = (props: { onClick: MouseEventHandler; children?: ReactNode }) => {
	return (
		<HeaderWrapper onClick={props.onClick} disabled={!props.children}>
			<div>{props.children}</div>
			<div>&#x2193;</div>
		</HeaderWrapper>
	);
};

const DropDownContainerWrapper = styled.div`
	position: relative;
	display: flex;
	background-color: white;
	flex-flow: wrap column;
	border: 2px solid gray;
	border-radius: 4px;
	user-select: none;
	z-index: 999;
`;

const DropDownItemWraper = styled(Item)<{ selected: boolean }>`
	align-items: center;
	padding: 0 10px;
	background-color: ${(props) => (props.selected ? 'dodgerblue' : 'white')};
	&:hover {
		background-color: ${(props) => (props.selected ? 'dodgerblue' : 'lavender')};
		color: black;
	}
`;

const DropDownItem = (props: {
	children?: ReactNode;
	selected: boolean;
	onClick: MouseEventHandler;
}) => {
	return (
		<DropDownItemWraper onClick={props.onClick} selected={props.selected}>
			{props.children}
		</DropDownItemWraper>
	);
};

type SelectProps = {
	label: string;
	value: string | number;
	list: { [key: string]: number };
	onChange: CallableFunction;
};

const Select = (props: SelectProps): ReactElement => {
	const [isContainerHidden, setContainerHidden] = useState(true);
	const ref = useRef<HTMLDivElement | null>(null);

	useEffect(() => {
		document.addEventListener('mousedown', onClickOutside);
		return () => document.removeEventListener('mousedown', onClickOutside);
	});

	const onClickOutside = (event: MouseEvent) => {
		if (!ref.current?.contains(event.target as Node)) setContainerHidden(true);
	};

	const onClickHandler = () => setContainerHidden(!isContainerHidden);

	const onItemClickHandler = (value: number | string) => {
		setContainerHidden(true);
		props.onChange(value);
	};

	return (
		<div>
			{props.label}
			<div style={{ position: 'relative' }} ref={ref}>
				<Header onClick={onClickHandler}>
					{Object.keys(props.list).find((item) => props.list[item] === props.value)}
				</Header>
				{!isContainerHidden && (
					<div style={{ position: 'absolute', top: '100%', width: 'calc(100% - 1px)' }}>
						<DropDownContainerWrapper>
							{Object.keys(props.list).map((item, i) => (
								<DropDownItem
									key={i}
									selected={props.list[item] === props.value}
									onClick={() => onItemClickHandler(props.list[item])}
								>
									{item}
								</DropDownItem>
							))}
						</DropDownContainerWrapper>
					</div>
				)}
			</div>
		</div>
	);
};

export default Select;
