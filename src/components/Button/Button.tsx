import styled from 'styled-components';

const Button = styled.button`
	width: 8rem;
	height: 2.9rem;
	background-color: #673ab7;
	color: #cfd8dc;
	border-radius: 6px;
	font-size: 14px;
	font-weight: bold;
	font-family: 'Roboto';
	border: none;
	margin: 0 5px;
	&:hover {
		background-color: #a984e9;
	}
	&:active {
		transform: scale(0.95);
	}
`;

export default Button;
