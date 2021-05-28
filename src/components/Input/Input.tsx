import React, { ReactElement } from 'react';
import styled from 'styled-components';

const InputWrapper = styled.div`
	display: flex;
	flex-flow: nowrap row;
	justify-content: space-between;
	background-color: white;
	overflow: hidden;
	box-sizing: border-box;
	min-height: 38px;

	& > input[type='number']::-webkit-outer-spin-button,
	input[type='number']::-webkit-inner-spin-button {
		-webkit-appearance: none;
		margin: 0;
	}
	& > input[type='number'] {
		-moz-appearance: textfield;
		font-family: Roboto;
		font-size: inherit;
		font-weight: bold;
		box-sizing: border-box;
		width: 100%;
		border: none;
		padding: 10px;
		white-space: nowrap;
		overflow: hidden;
	}
	border: 2px solid gray;
	border-radius: 4px;
`;

const Input = (props: {
	label: string;
	value: number;
	onChange: React.ChangeEventHandler<HTMLInputElement>;
}): ReactElement => {
	return (
		<div>
			{props.label}
			<InputWrapper>
				<input type={'number'} min={0} value={props.value} onChange={props.onChange} />
			</InputWrapper>
		</div>
	);
};

export default Input;
