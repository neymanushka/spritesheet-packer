import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import copy from 'rollup-plugin-copy';
import resolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import commonjs from '@rollup/plugin-commonjs';
import replace from 'rollup-plugin-replace';
import { terser } from 'rollup-plugin-terser';

export default {
	input: 'src/index.tsx',
	output: {
		file: 'dist/bundle.js',
		sourcemap: true,
		format: 'iife',
	},
	plugins: [
		peerDepsExternal(),
		copy({ targets: [{ src: 'src/static/index.html', dest: 'dist' }] }),
		typescript({ lib: ['es5', 'es6', 'dom'], target: 'es2020', sourceMap: true }),
		commonjs({ extensions: ['.js', '.ts'] }),
		resolve({ browser: true, extensions: ['.ts', '.tsx', '.js', '.css'] }),
		replace({
			'process.env.NODE_ENV': JSON.stringify('production'),
		}),
		terser()
	],
};
