// ==UserScript==
// @name         <%= testName %>: Shared
// @namespace    http://tampermonkey.net/
// @version      0.1
// @author       <%= developer %>
// @description  <%= testDescription %>
// @grant        GM_addStyle
// @grant        GM_getResourceText
// ==/UserScript==

var sharedCssFile = GM_getResourceText("sharedCssFile");
GM_addStyle(sharedCssFile);

var cssFile = GM_getResourceText("cssFile");
GM_addStyle(cssFile);
