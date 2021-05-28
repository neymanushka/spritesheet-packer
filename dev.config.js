import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import json from '@rollup/plugin-json';
import copy from 'rollup-plugin-copy-watch';
import resolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import commonjs from '@rollup/plugin-commonjs';
import replace from 'rollup-plugin-replace';

import serve from 'rollup-plugin-serve';
import livereload from 'rollup-plugin-livereload';

export default {
	input: 'src/index.tsx',
	output: {
		file: 'dist/bundle.js',
		sourcemap: true,
		format: 'iife',
	},
	plugins: [
		serve({
			open: true,
			verbose: true,
			contentBase: ['', 'dist'],
			host: 'localhost',
			port: 8080,
		}),
		livereload({ watch: 'dist' }),
		copy({
			watch: 'src/static',
			targets: [{ src: 'src/static/index.html', dest: 'dist' }],
		}),
		json(),
		peerDepsExternal(),
		typescript({ lib: ['es5', 'es6', 'dom'], target: 'es2020', sourceMap: true }),
		commonjs({ extensions: ['.js', '.ts'] }),
		resolve({ browser: true, extensions: ['.ts', '.tsx', '.js', '.css'] }),
		replace({
			'process.env.NODE_ENV': JSON.stringify('development'),
		}),
	],
};
