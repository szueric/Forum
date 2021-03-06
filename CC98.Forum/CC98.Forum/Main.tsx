﻿import 'es6-promise/auto';
import 'core-js/shim';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as $ from 'jquery';
import store from './Store';
import { Provider } from 'react-redux';
import 'whatwg-fetch';
import 'blueimp-canvas-to-blob';

import { Constants } from './Components/Constant';
import App from './Components/App';
import { IndexedDB } from './IndexedDB/IndexedDB';

/**
 * 项目初始化代码
 */
async function initialize() {

	await Constants.loadConfig();
	if(window.indexedDB) await IndexedDB.start();

	// 输出一些没用的东西
	console.info('%c       ', 'font-size: 100px; background: url(http://cdn.nyanit.com/nyan2.gif) no-repeat;');
	console.info('%cCC98 Durian', 'font-size: 80px; fontFamily: Big');

	// 显示应用程序核心内容
	ReactDOM.render(
		<Provider store={store}>
			<App />
		</Provider>,
		document.getElementById('root')

	);
}

initialize();
